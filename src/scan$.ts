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
export type ScanOrigin<D = unknown> =
  | AnyAwaitableIterable<D>
  | AnySubscribable<D>;

export type ScanOriginValue<O extends ScanOrigin> =
  & (O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type ScanCallback<T, S> = (state: S, item: T) => S;

export type ScanResult<O, R> =
  & (O extends AnyIterable
    ? SimpleIterator<R>
    : O extends AnyAsyncIterable
      ? SimpleAsyncIterator<R>
      : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

/**
 * Apply reducer-like function to each emitted value, emitting each result.
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 */
export function scan$<O extends ScanOrigin, const S>(cb: ScanCallback<ScanOriginValue<O>, S>, init: S): PipeStep<O, ScanResult<O, S>>;

export function scan$<D, const S>(cb: ScanCallback<D, S>, init: S) {
  return (origin: ScanOrigin<D>) => {
    const builder = resource$<S>();
    let state = init;

    if (isIterable<D>(origin) || isAsyncIterable<D>(origin) || isAwaitableIterator<D>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      const result = iterator.next();

      if (isPromise(result)) {
        builder.add(asyncIterator$<S>((async function* () {
          let res = await result;

          while (!res.done) {
            state = cb(state, res.value);
            yield state;

            res = await (iterator as MinimalAsyncIterator<D>).next();
          }
        })()));
      } else {
        let res = result;

        builder.add(iterator$<S>((function* () {
          while (!res.done) {
            state = cb(state, res.value);
            yield state;

            res = (iterator as MinimalIterator<D>).next();
          }
        })()));
      }
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      const observable = extractSubscribable(origin);

      builder.add(observable$<S>((observer, signal) => {
        boundedSubscription(observable, signal, {
          next: (item) => {
            state = cb(state, item);
            observer.next(state);
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      }));
    }

    return builder.build();
  };
}
