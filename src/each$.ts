import type {
  AsyncMutable,
  AsyncDeferrable,
  AsyncRefreshable,
  Awaitable,
  Mutable,
  Observable,
  Deferrable,
  Refreshable,
  Subscribable
} from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { applyFn } from './utils/fn.js';
import { isMutable, isDeferrable, isRefreshable, isSubscribable } from './utils/predicates.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type EachOrigin<D = unknown> =
  | Subscribable<D>
  | Deferrable<Awaitable<D>>
  | Refreshable<Awaitable<D>>
  | Mutable<any, Awaitable<D>>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type EachMutable<O extends Mutable, A, D> = O extends AsyncMutable ? AsyncMutable<A, D> : Mutable<A, D>;
export type EachDeferrable<O extends Deferrable, D> = O extends AsyncDeferrable ? AsyncDeferrable<D> : Deferrable<D>;
export type EachRefreshable<O extends Refreshable, D> = O extends AsyncRefreshable ? AsyncRefreshable<D> : Refreshable<D>;

export type EachOriginValue<O extends EachOrigin> =
  & (O extends Subscribable<infer D> ? D : unknown)
  & (O extends Deferrable<infer D> ? Awaited<D> : unknown)
  & (O extends Refreshable<infer D> ? Awaited<D> : unknown)
  & (O extends Mutable<any, infer D> ? Awaited<D> : unknown); // eslint-disable-line @typescript-eslint/no-explicit-any

export type EachResult<O, R> =
  & (O extends Subscribable ? Observable<R> : unknown)
  & (O extends Deferrable ? EachDeferrable<O, R> : unknown)
  & (O extends Refreshable ? EachRefreshable<O, R> : unknown)
  & (O extends Mutable<infer A> ? EachMutable<O, A, R> : unknown);

/**
 * Applies given function on every emitted values,
 * including values returned by defer and mutate if present.
 */
export function each$<O extends EachOrigin, R>(fn: (arg: EachOriginValue<O>) => R): PipeStep<O, EachResult<O, R>>;

export function each$<A, R>(fn: (arg: A) => R) {
  return (origin: unknown) => {
    const builder = resource$<R>();

    if (isSubscribable<A>(origin)) {
      builder.add(observable$<R>((observer, signal) => {
        boundedSubscription(origin, signal, {
          next(val) {
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

    if (isRefreshable<A>(origin)) {
      builder.add({
        refresh: (signal) => applyFn(fn, origin.refresh(signal)),
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
