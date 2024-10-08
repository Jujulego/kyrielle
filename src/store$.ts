import type {
  Awaitable,
  Mutable,
  Observable,
  ObservedValue,
  Deferrable,
  Refreshable,
  Subscribable
} from './defs/index.js';
import { merge$ } from './merge$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { isMutable, isPromise, isDeferrable, isSubscribable } from './utils/predicates.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export interface StoreDeferrableOrigin<out D = unknown> extends Subscribable<D>, Deferrable<Awaitable<D>> {}
export interface StoreMutableOrigin<out D = unknown> extends Subscribable<D>, Mutable<any, Awaitable<D>> {} // eslint-disable-line @typescript-eslint/no-explicit-any

export type StoreOrigin<D = unknown> = Subscribable<D>
  | StoreDeferrableOrigin<D>
  | StoreMutableOrigin<D>;

export interface StoreReference<in out D = unknown> extends Deferrable<D | undefined>, Mutable<D, D>, Partial<Subscribable<D>> {}

export interface StoredResource<out D = unknown> extends Deferrable<D | undefined>, Observable<D> {}

export type StoreResult<O extends StoreOrigin> = StoredResource<ObservedValue<O>>
  & (O extends Deferrable<infer R> ? Refreshable<R> : unknown)
  & (O extends Mutable<infer A, infer R> ? Mutable<A, R> : unknown);

/**
 * Stores origin's data into given reference, to make it synchronous.
 */
export function store$<O extends StoreOrigin>(ref: StoreReference<ObservedValue<O>>): PipeStep<O, StoreResult<O>>;

export function store$<D>(reference: StoreReference<D>): PipeStep<Subscribable<D>, StoredResource<D>> {
  return (origin: Subscribable<D>) => {
    // Prepare observable
    let observable: Observable<D> = observable$<D>((obs, signal) => {
      boundedSubscription(origin, signal, {
        next(data) {
          reference.mutate(data);
          obs.next(data);
        },
        error: (err) => obs.error(err),
        complete: () => obs.complete(),
      });
    });

    if (isSubscribable<D>(reference)) {
      observable = merge$(observable, reference);
    }

    // Setup resource
    const builder = resource$()
      .add(observable)
      .add({ defer: reference.defer.bind(reference) });

    function handleResult(result: Awaitable<D>): Awaitable<D> {
      if (isPromise(result)) {
        void result.then((data) => reference.mutate(data));
      } else {
        reference.mutate(result);
      }

      return result;
    }

    // Add refresh method
    if (isDeferrable<Awaitable<D>>(origin)) {
      builder.add({
        refresh: (signal?: AbortSignal) => handleResult(origin.defer(signal)),
      });
    }

    // Add mutate method
    if (isMutable<unknown, Awaitable<D>>(origin)) {
      builder.add({
        mutate: (arg: unknown, signal?: AbortSignal) => handleResult(origin.mutate(arg, signal)),
      });
    }

    return builder.build();
  };
}
