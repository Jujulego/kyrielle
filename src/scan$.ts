import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type { AnyIterable, IteratedValue } from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { SimpleIterator } from './types/outputs/SimpleIterator.js';
import { extractIterator } from './utils/iterator.js';
import { isIterable, isMinimalIterator, isSubscribable, isSubscribableHolder } from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type ScanOrigin<D = unknown> =
  | AnyIterable<D>
  | AnySubscribable<D>;

export type ScanOriginValue<O extends ScanOrigin> =
  & (O extends AnyIterable ? IteratedValue<O> : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type ScanCallback<T, S> = (state: S, item: T) => S;

export type ScanResult<O, R> =
  & (O extends AnyIterable ? SimpleIterator<R> : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

/**
 * Apply reducer-like function to each emitted value, emitting each result.
 *
 * @since 1.0.0
 */
export function scan$<O extends ScanOrigin, const S>(cb: ScanCallback<ScanOriginValue<O>, S>, init: S): PipeStep<O, ScanResult<O, S>>;

/**
 * Apply reducer-like function to each emitted value, emitting each result.
 *
 * @since 1.0.0
 */
export function scan$<D, const S>(cb: ScanCallback<D, S>, init: S) {
  return (origin: ScanOrigin<D>) => {
    const builder = resource$<S>();
    let state = init;

    if (isIterable<D>(origin) || isMinimalIterator<D>(origin)) {
      const iterator = extractIterator(origin);
      builder.add(iterator$<S>({
        next: () => {
          const { done, value } = iterator.next();

          if (done) {
            return { done: true };
          } else {
            state = cb(state, value);
            return { done: false, value: state };
          }
        }
      }));
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
