import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type { AnyIterable, IteratedValue, MinimalIterator } from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { SimpleIterator } from './types/outputs/SimpleIterator.js';
import { extractIterator } from './utils/iterator.js';
import { isIterable, isMinimalIterator, isSubscribable, isSubscribableHolder } from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type FlatOrigin<D = unknown> =
  | AnyIterable<AnyIterable<D>>
  | AnySubscribable<AnyIterable<D>>;

export type FlatOriginValue<O extends FlatOrigin> =
  & (O extends AnyIterable ? IteratedValue<O> : unknown)
  & (O extends AnySubscribable<infer D> ? D : unknown);

export type FlatResult<O, R> =
  & (O extends AnyIterable ? SimpleIterator<R> : unknown)
  & (O extends AnySubscribable ? Observable<R> : unknown);

export type FlatResultValue<D> = D extends AnyIterable ? IteratedValue<D> : unknown;

/**
 * Flattens origin.
 *
 * @since 1.0.0
 */
export function flat$<O extends FlatOrigin>(): PipeStep<O, FlatResult<O, FlatResultValue<FlatOriginValue<O>>>>;

export function flat$<D, I extends AnyIterable<D>>() {
  return (origin: FlatOrigin) => {
    const builder = resource$<D>();

    if (isIterable<I>(origin) || isMinimalIterator<I>(origin)) {
      const iterator = extractIterator(origin);
      let queue: MinimalIterator<D> | null = null;

      builder.add(iterator$<D>({
        next: () => {
          while (true) {
            if (queue) {
              const { done, value } = queue.next();

              if (done) {
                queue = null;
              } else {
                return { done: false, value };
              }
            } else {
              const { done, value } = iterator.next();

              if (done) {
                return { done: true };
              } else {
                queue = extractIterator(value);
              }
            }
          }
        }
      }));
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