import { asyncIterator$ } from './async-iterator$.js';
import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
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
import type { SimpleAsyncIterator, SimpleIterator } from './types/outputs/SimpleIterator.js';
import type { PredicateFn } from './types/utils.js';
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
export type FilterOrigin<D = unknown> =
  | AnyAwaitableIterable<D>
  | AnySubscribable<D>;

export type FilterOriginValue<O extends FilterOrigin> =
  & (O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type FilterResult<O, R> =
  & (O extends AnyIterable
    ? SimpleIterator<R>
    : O extends AnyAsyncIterable
      ? SimpleAsyncIterator<R>
        : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

/**
 * Filters emitted values using given predicate
 * @param predicate
 *
 * @since 1.0.0
 * @version 2.5.0 adds support for async iterators
 */
export function filter$<O extends FilterOrigin, R extends FilterOriginValue<O>>(predicate: PredicateFn<FilterOriginValue<O>, R>): PipeStep<O, FilterResult<O, R>>;

/**
 * Filters emitted values using given predicate
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 */
export function filter$<O extends FilterOrigin>(predicate: (val: FilterOriginValue<O>) => boolean): PipeStep<O, FilterResult<O, FilterOriginValue<O>>>;

export function filter$<D>(predicate: (val: D) => boolean) {
  return (origin: unknown) => {
    const builder = resource$<D>();

    if (isIterable<D>(origin) || isAsyncIterable<D>(origin) || isAwaitableIterator<D>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      const result = iterator.next();

      if (isPromise(result)) {
        builder.add(asyncIterator$<D>((async function* () {
          let res = await result;

          while (!res.done) {
            if (predicate(res.value)) {
              yield res.value;
            }

            res = await (iterator as MinimalAsyncIterator<D>).next();
          }
        })()));
      } else {
        let res = result;

        builder.add(iterator$<D>((function* () {
          while (!res.done) {
            if (predicate(res.value)) {
              yield res.value;
            }

            res = (iterator as MinimalIterator<D>).next();
          }
        })()));
      }
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      const observable = extractSubscribable(origin);
      builder.add(observable$<D>((observer, signal) => {
        boundedSubscription(observable, signal, {
          next: (val) => {
            if (predicate(val)) {
              observer.next(val);
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
