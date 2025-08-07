import { observable$ } from './observable$.js';
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
export type CollectOrigin<D = unknown> =
  | AnyAwaitableIterable<D>
  | AnySubscribable<D>;

export type CollectResult<O extends CollectOrigin> =
  O extends AnyIterable
    ? IteratedValue<O>[]
    : O extends AnyAsyncIterable
      ? Observable<AsyncIteratedValue<O>[]>
      : O extends AnySubscribable<infer D>
        ? Observable<D[]>
        : never;

/**
 * Collect all emitted items into an array, until observable complete.
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 */
export function collect$<O extends CollectOrigin>(): PipeStep<O, CollectResult<O>>

export function collect$<D>(): PipeStep<CollectOrigin<D>, D[] | Observable<D[]> | undefined> {
  return (origin: AnyAwaitableIterable<D> | AnySubscribable<D>) => {
    const output: D[] = [];

    if (isIterable<D>(origin) || isAsyncIterable<D>(origin) || isAwaitableIterator<D>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      let result = iterator.next();

      if (isPromise(result)) {
        return observable$(async (observer, signal) => {
          let res = await result;

          while (!res.done) {
            signal.throwIfAborted();

            output.push(res.value);
            res = await (iterator as MinimalAsyncIterator<D>).next();
          }

          observer.next(output);
          observer.complete();
        });
      } else {
        while (!result.done) {
          output.push(result.value);
          result = (iterator as MinimalIterator<D>).next();
        }

        return output;
      }
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      return observable$((observer, signal) => {
        boundedSubscription(extractSubscribable(origin), signal, {
          next(item) {
            output.push(item);
          },
          error: (err) => observer.error(err),
          complete: () => {
            observer.next(output);
            observer.complete();
          },
        });
      });
    }
  };
}
