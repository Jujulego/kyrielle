import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type { AsyncDeferrable, Deferrable } from './types/inputs/Deferrable.js';
import type { AnyIterable, IteratedValue } from './types/inputs/MinimalIterator.js';
import type { AsyncMutable, Mutable } from './types/inputs/Mutable.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { AsyncMutator, Mutator } from './types/outputs/Mutator.js';
import type { Observable } from './types/outputs/Observable.js';
import type { AsyncRef, Ref } from './types/outputs/Ref.js';
import type { SimpleIterator } from './types/outputs/SimpleIterator.js';
import type { Awaitable } from './types/utils.js';
import { applyFn } from './utils/fn.js';
import { extractIterator } from './utils/iterator.js';
import {
  isDeferrable,
  isIterable,
  isMinimalIterator,
  isMutable,
  isSubscribable,
  isSubscribableHolder
} from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type MapOrigin<D = unknown> =
  | AnyIterable<D>
  | AnySubscribable<D>
  | Deferrable<Awaitable<D>>
  | Mutable<any, Awaitable<D>>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type MapMutable<O extends Mutable, A, D> = O extends AsyncMutable ? AsyncMutator<A, D> : Mutator<A, D>;
export type MapDeferrable<O extends Deferrable, D> = O extends AsyncDeferrable ? AsyncRef<D> : Ref<D>;

export type MapOriginValue<O extends MapOrigin> =
  & (O extends AnyIterable ? IteratedValue<O> : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown)
  & (O extends Deferrable<infer D> ? Awaited<D> : unknown)
  & (O extends Mutable<any, infer D> ? Awaited<D> : unknown); // eslint-disable-line @typescript-eslint/no-explicit-any

export type MapResult<O, R> =
  & (O extends AnyIterable ? SimpleIterator<R> : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown)
  & (O extends Deferrable ? MapDeferrable<O, R> : unknown)
  & (O extends Mutable<infer A> ? MapMutable<O, A, R> : unknown);

/**
 * Applies given function on every emitted values,
 * including values returned by defer and mutate if present.
 *
 * @since 1.0.0
 */
export function map$<O extends MapOrigin, R>(fn: (arg: MapOriginValue<O>) => R): PipeStep<O, MapResult<O, R>>;

export function map$<A, R>(fn: (arg: A) => R) {
  return (origin: unknown) => {
    const builder = resource$<R>();

    if (isIterable<A>(origin) || isMinimalIterator<A>(origin)) {
      const iterator = extractIterator(origin);
      builder.add(iterator$<R>({
        next: () => {
          const next = iterator.next();

          return next.done
            ? { done: true }
            : { done: false, value: fn(next.value) };
        }
      }));
    }

    if (isSubscribable<A>(origin) || isSubscribableHolder<A>(origin)) {
      const observable = extractSubscribable(origin);
      builder.add(observable$<R>((observer, signal) => {
        boundedSubscription(observable, signal, {
          next: (val) => {
            observer.next(fn(val));
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      }));
    }

    if (isDeferrable<A>(origin)) {
      builder.add({
        defer: (signal) => applyFn(fn, origin.defer(signal)),
      });
    }

    if (isMutable<unknown, A>(origin)) {
      builder.add({
        mutate: (arg, signal) => applyFn(fn, origin.mutate(arg, signal)),
      });
    }

    return builder.build();
  };
}
