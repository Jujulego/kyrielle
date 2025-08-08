import { asyncIterator$ } from './async-iterator$.js';
import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type {
  AnyAsyncIterable,
  AnyIterable,
  AsyncIteratedValue,
  IteratedValue,
  MinimalIterator
} from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { SimpleAsyncIterator, SimpleIterator } from './types/outputs/SimpleIterator.js';
import { extractAwaitableIterator, extractIterator } from './utils/iterator.js';
import {
  isAsyncIterable,
  isAwaitableIterator,
  isIterable, isPromise,
  isSubscribable,
  isSubscribableHolder
} from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Flattens origin.
 *
 * @since 2.1.0
 * @version 2.5.0 Add support for async iterators
 */
export function flat$<O extends FlatOrigin>(): PipeStep<O, FlatResult<O, FlatResultValue<FlatOriginValue<O>>>>;

export function flat$<D, I extends AnyIterable<D>>() {
  return (origin: FlatOrigin) => {
    const builder = resource$<D>();

    if (isIterable<I>(origin) || isAsyncIterable<I>(origin) || isAwaitableIterator<I>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      const result = iterator.next();

      if (isPromise(result)) {
        builder.add(asyncIterator$<D>((async function* () {
          let res = await result;

          while (!res.done) {
            const it = extractIterator(res.value);

            while (true) {
              const { value, done } = it.next();

              if (done) {
                break;
              } else {
                yield value;
              }
            }

            res = await iterator.next();
          }
        })()));
      } else {
        let res = result;

        builder.add(iterator$<D>((function* () {
          while (!res.done) {
            const it = extractIterator(res.value);

            while (true) {
              const { value, done } = it.next();

              if (done) {
                break;
              } else {
                yield value;
              }
            }

            res = (iterator as MinimalIterator<I>).next();
          }
        })()));
      }
    }

    if (isSubscribable<I>(origin) || isSubscribableHolder<I>(origin)) {
      const observable = extractSubscribable(origin);

      builder.add(observable$<D>((observer, signal) => {
        boundedSubscription(observable, signal, {
          next: (item) => {
            const iterator = extractIterator(item);

            while (true) {
              const { done, value } = iterator.next();

              if (done) {
                break;
              } else {
                observer.next(value);
              }
            }
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      }));
    }

    return builder.build();
  };
}

// Types
export type FlatOrigin<D = unknown> =
  | AnyIterable<AnyIterable<D>>
  | AnyAsyncIterable<AnyIterable<D>>
  | AnySubscribable<AnyIterable<D>>;

export type FlatOriginValue<O extends FlatOrigin> =
  & (O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type FlatResult<O, R> =
  & (O extends AnyIterable
    ? SimpleIterator<R>
    : O extends AnyAsyncIterable
      ? SimpleAsyncIterator<R>
      : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

export type FlatResultValue<D> = D extends AnyIterable ? IteratedValue<D> : unknown;
