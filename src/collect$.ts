import { extend$ } from './extend$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { AnyExtendable, Extendable } from './types/inputs/Extendable.js';
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

export type CollectData<O extends CollectOrigin> =
  O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : O extends AnySubscribable<infer D>
        ? D
        : never;

export type CollectTarget<D = unknown> = AnyExtendable<D>;

export type CollectResult<O extends CollectOrigin, T extends CollectTarget<CollectData<O>> = CollectData<O>[]> =
  O extends AnyIterable
    ? T
    : O extends AnyAsyncIterable
      ? Observable<T>
      : O extends AnySubscribable
        ? Observable<T>
        : never;

/**
 * Collect all emitted items into an array, until observable complete.
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 * @version 2.6.0 Accepts extendable target
 */
export function collect$<O extends CollectOrigin>(): PipeStep<O, CollectResult<O>>;
export function collect$<O extends CollectOrigin, T extends CollectTarget<CollectData<O>>>(target: T): PipeStep<O, CollectResult<O, T>>;

export function collect$<D>(target: Extendable<D> = []): PipeStep<CollectOrigin<D>, Extendable<D> | Observable<Extendable<D>> | undefined> {
  return (origin: AnyAwaitableIterable<D> | AnySubscribable<D>) => {
    if (isIterable<D>(origin) || isAsyncIterable<D>(origin) || isAwaitableIterator<D>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      let result = iterator.next();

      if (isPromise(result)) {
        return observable$(async (observer, signal) => {
          let res = await result;

          while (!res.done) {
            signal.throwIfAborted();

            extend$(target, res.value);
            res = await (iterator as MinimalAsyncIterator<D>).next();
          }

          observer.next(target);
          observer.complete();
        });
      } else {
        while (!result.done) {
          extend$(target, result.value);
          result = (iterator as MinimalIterator<D>).next();
        }

        return target;
      }
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      return observable$((observer, signal) => {
        boundedSubscription(extractSubscribable(origin), signal, {
          next(item) {
            extend$(target, item);
          },
          error: (err) => observer.error(err),
          complete: () => {
            observer.next(target);
            observer.complete();
          },
        });
      });
    }
  };
}
