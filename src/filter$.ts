import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { PredicateFn } from './types/utils.js';
import type { AnySubscribable, Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 *
 * @since 1.0.0
 */
export function filter$<O extends AnySubscribable, R extends SubscribableValue<O>>(predicate: PredicateFn<SubscribableValue<O>, R>): PipeStep<O, Observable<R>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 *
 * @since 1.0.0
 */
export function filter$<O extends Subscribable>(predicate: (val: SubscribableValue<O>) => boolean): PipeStep<O, Observable<SubscribableValue<O>>>;

export function filter$(predicate: (val: unknown) => boolean): PipeStep<Subscribable, Observable> {
  return (origin) => observable$((observer, signal) => {
    boundedSubscription(origin, signal, {
      next: (val) => {
        if (predicate(val)) {
          observer.next(val);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });
  });
}
