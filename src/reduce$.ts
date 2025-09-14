import { oncervable$ } from './oncervable$.js';
import type { PipeStep } from './pipe$.js';
import type {
  AnyAsyncIterable,
  AnyAwaitableIterable,
  AnyIterable,
  AsyncIteratedValue,
  IteratedValue,
  MinimalAsyncIterator,
  MinimalIterator
} from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { Oncervable } from './types/outputs/Oncervable.js';
import { extractAwaitableIterator } from './utils/iterator.js';
import {
  isAsyncIterable,
  isAwaitableIterator,
  isIterable,
  isPromise,
  isSubscribable,
  isSubscribableHolder
} from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type ReduceOrigin<D = unknown> =
  | AnyAwaitableIterable<D>
  | AnySubscribable<D>;

export type ReduceOriginValue<O extends ReduceOrigin> =
  & (O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type ReduceCallback<T, S> = (state: S, item: T) => S;

export type ReduceResult<O, R> =
  O extends AnyIterable
    ? R
    : O extends AnyAsyncIterable
      ? Oncervable<R>
      : O extends AnySubscribable
        ? Oncervable<R>
        : never;

/**
 * Apply reducer-like function to each emitted value, emitting final result with origin completes.
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 * @version 2.6.0 Returns an Oncervable
 */
export function reduce$<O extends ReduceOrigin, S>(cb: ReduceCallback<ReduceOriginValue<O>, S>, init: S): PipeStep<O, ReduceResult<O, S>>;

export function reduce$<D, S>(cb: ReduceCallback<D, S>, init: S): PipeStep<ReduceOrigin<D>, S | Observable<S> | undefined> {
  return (origin: ReduceOrigin<D>) => {
    let state = init;

    if (isIterable<D>(origin) || isAsyncIterable<D>(origin) || isAwaitableIterator<D>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      let result = iterator.next();

      if (isPromise(result)) {
        return oncervable$(async ({ signal }) => {
          let res = await result;

          while (!res.done) {
            signal.throwIfAborted();

            state = cb(state, res.value);
            res = await (iterator as MinimalAsyncIterator<D>).next();
          }

          return state;
        });
      } else {
        while (!result.done) {
          state = cb(state, result.value);
          result = (iterator as MinimalIterator<D>).next();
        }

        return state;
      }
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      return oncervable$(({ resolve, reject, signal }) => {
        boundedSubscription(extractSubscribable(origin), signal, {
          next(item) {
            state = cb(state, item);
          },
          error: reject,
          complete: () => {
            resolve(state);
          },
        });
      });
    }
  };
}
