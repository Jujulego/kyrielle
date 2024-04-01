import {
  AsyncMutable,
  AsyncReadable,
  Awaitable,
  Mutable,
  Observable,
  Subscribable,
  Readable, type Unsubscribable
} from './defs/index.js';
import { isMutable, isSubscribable, isPromise, isReadable } from './utils/predicates.js';
import { observable$ } from './observable$.js';
import { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';

// Types
export type EachOrigin<D = unknown> =
  | Subscribable<D>
  | Readable<Awaitable<D>>
  | Mutable<any, Awaitable<D>>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type EachMutable<O extends Mutable, A, D> = O extends AsyncMutable ? AsyncMutable<A, D> : Mutable<A, D>;
export type EachReadable<O extends Readable, D> = O extends AsyncReadable ? AsyncReadable<D> : Readable<D>;

export type EachOriginValue<O extends EachOrigin> =
  & (O extends Subscribable<infer D> ? D : unknown)
  & (O extends Readable<infer D> ? Awaited<D> : unknown)
  & (O extends Mutable<any, infer D> ? Awaited<D> : unknown); // eslint-disable-line @typescript-eslint/no-explicit-any

export type EachResult<O, R> =
  & (O extends Subscribable ? Observable<R> : unknown)
  & (O extends Readable ? EachReadable<O, R> : unknown)
  & (O extends Mutable<infer A> ? EachMutable<O, A, R> : unknown);

/**
 * Applies given function on every emitted values,
 * including values returned by read and mutate if present.
 */
export function each$<O extends EachOrigin, R>(fn: (arg: EachOriginValue<O>) => R): PipeStep<O, EachResult<O, R>>;

export function each$<A, R>(fn: (arg: A) => R) {
  return (origin: unknown) => {
    const builder = resource$<R>();

    if (isSubscribable<A>(origin)) {
      builder.add(observable$<R>((observer, signal) => {
        let subscription: Unsubscribable;

        origin.subscribe({
          start(sub) {
            subscription = sub;
            signal.addEventListener('abort', sub.unsubscribe, { once: true });
          },
          next(val) {
            observer.next(fn(val));
          },
          error: observer.error,
          complete() {
            signal.removeEventListener('abort', subscription.unsubscribe);
            observer.complete();
          }
        });
      }));
    }

    if (isReadable<A>(origin)) {
      builder.add({
        read(signal) {
          const res = origin.read(signal);

          if (isPromise<A>(res)) {
            return res.then(fn);
          } else {
            return fn(res);
          }
        }
      });
    }

    if (isMutable<unknown, A>(origin)) {
      builder.add({
        mutate(arg, signal) {
          const res = origin.mutate(arg, signal);

          if (isPromise<A>(res)) {
            return res.then(fn);
          } else {
            return fn(res);
          }
        }
      });
    }

    return builder.build();
  };
}
