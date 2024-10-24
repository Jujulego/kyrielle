import type { MapOrigin } from './map$.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { AnyIterable, IteratedValue } from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { extractIterator } from './utils/iterator.js';
import { isIterable, isMinimalIterator, isSubscribable, isSubscribableHolder } from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type CollectOrigin<D = unknown> =
  | AnyIterable<D>
  | AnySubscribable<D>;

export type CollectResult<O extends MapOrigin> =
  O extends AnyIterable
    ? IteratedValue<O>[]
    : O extends AnySubscribable<infer D>
      ? Observable<D[]>
      : never;

/**
 * Collect all emitted items into an array, until observable complete
 *
 * @since 1.0.0
 */
export function collect$<O extends CollectOrigin>(): PipeStep<O, CollectResult<O>>

export function collect$<D>(): PipeStep<CollectOrigin<D>, D[] | Observable<D[]> | undefined> {
  return (origin: AnyIterable<D> | AnySubscribable<D>) => {
    const result: D[] = [];

    if (isIterable<D>(origin) || isMinimalIterator<D>(origin)) {
      const iterator = extractIterator(origin);

      while (true) {
        const { done, value } = iterator.next();
        if (done) break;

        result.push(value);
      }

      return result;
    }

    if (isSubscribable<D>(origin) || isSubscribableHolder<D>(origin)) {
      return observable$((observer, signal) => {
        boundedSubscription(extractSubscribable(origin), signal, {
          next(item) {
            result.push(item);
          },
          error: (err) => observer.error(err),
          complete: () => {
            observer.next(result);
            observer.complete();
          },
        });
      });
    }
  };
}
