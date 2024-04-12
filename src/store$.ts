import type { Awaitable, Mutable, Observable, ObservedValue, Readable, Subscribable } from './defs/index.js';
import { isMutable, isPromise, isReadable } from './utils/predicates.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export interface StoreReadableOrigin<out D = unknown> extends Subscribable<D>, Readable<Awaitable<D>> {}
export interface StoreMutableOrigin<out D = unknown> extends Subscribable<D>, Mutable<any, Awaitable<D>> {} // eslint-disable-line @typescript-eslint/no-explicit-any

export type StoreOrigin<D = unknown> = Subscribable<D>
  | StoreReadableOrigin<D>
  | StoreMutableOrigin<D>;

export interface StoreReference<in out D = unknown> extends Readable<D | undefined>, Mutable<D, D> {}

export interface StoredResource<out D = unknown> extends Readable<D | undefined>, Observable<D> {}
export interface Refreshable<out R = unknown> {
  refresh(signal?: AbortSignal): R
}

export type StoreResult<O extends StoreOrigin> = StoredResource<ObservedValue<O>>
  & (O extends Readable<infer R> ? Refreshable<R> : unknown)
  & (O extends Mutable<infer A, infer R> ? Mutable<A, R> : unknown);

/**
 * Stores origin's data into given reference, to make it synchronous.
 */
export function store$<O extends StoreOrigin>(ref: StoreReference<ObservedValue<O>>): PipeStep<O, StoreResult<O>>;

export function store$<D>(reference: StoreReference<D>): PipeStep<Subscribable<D>, StoredResource<D>> {
  return (origin: Subscribable<D>) => {
    // Setup resource
    const result = resource$()
      .add(observable$<D>((obs, signal) => {
        boundedSubscription(origin, signal, {
          next(data) {
            reference.mutate(data);
            obs.next(data);
          },
          error: obs.error,
          complete: obs.complete,
        });
      }))
      .add({ read: (signal) => reference.read(signal) })
      .build();

    function handleResult(result: Awaitable<D>): Awaitable<D> {
      if (isPromise(result)) {
        result.then((data) => reference.mutate(data));
      } else {
        reference.mutate(result);
      }

      return result;
    }

    // Add refresh method
    if (isReadable<Awaitable<D>>(origin)) {
      Object.assign(result, {
        refresh: (signal?: AbortSignal) => handleResult(origin.read(signal)),
      });
    }

    // Add mutate method
    if (isMutable<unknown, Awaitable<D>>(origin)) {
      Object.assign(result, {
        mutate: (arg: unknown, signal?: AbortSignal) => handleResult(origin.mutate(arg, signal)),
      });
    }

    return result;
  };
}