import { iterator$ } from './iterator$.js';
import type { MapOrigin } from './map$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type { AnyIterable, IteratedValue } from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { SimpleIterator } from './types/outputs/SimpleIterator.js';
import type { PredicateFn } from './types/utils.js';
import { extractIterator } from './utils/iterator.js';
import { isIterable, isMinimalIterator, isSubscribable, isSubscribableHolder } from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type FilterOrigin<D = unknown> =
  | AnyIterable<D>
  | AnySubscribable<D>;

export type FilterOriginValue<O extends MapOrigin> =
  & (O extends AnyIterable ? IteratedValue<O> : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type FilterResult<O, R> =
  & (O extends AnyIterable ? SimpleIterator<R> : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

/**
 * Filters emitted values using given predicate
 * @param predicate
 *
 * @since 1.0.0
 */
export function filter$<O extends FilterOrigin, R extends FilterOriginValue<O>>(predicate: PredicateFn<FilterOriginValue<O>, R>): PipeStep<O, FilterResult<O, R>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 *
 * @since 1.0.0
 */
export function filter$<O extends FilterOrigin>(predicate: (val: FilterOriginValue<O>) => boolean): PipeStep<O, FilterResult<O, FilterOriginValue<O>>>;

export function filter$<D>(predicate: (val: D) => boolean) {
  return (origin: unknown) => {
    const builder = resource$<D>();

    if (isIterable<D>(origin) || isMinimalIterator<D>(origin)) {
      const iterator = extractIterator(origin);
      builder.add(iterator$<D>({
        next: () => {
          while (true) {
            const { done, value } = iterator.next();

            if (done) {
              return { done: true };
            } else if (predicate(value)) {
              return { done: false, value };
            }
          }
        }
      }));
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
