import type { Observable, ObservedValue, Subscribable } from './defs/index.js';
import type { PredicateFn } from './defs/utils.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<O extends Subscribable, R extends ObservedValue<O>>(predicate: PredicateFn<ObservedValue<O>, R>): PipeStep<O, Observable<R>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<O extends Subscribable>(predicate: (val: ObservedValue<O>) => boolean): PipeStep<O, Observable<ObservedValue<O>>>;

export function filter$(predicate: (val: unknown) => boolean): PipeStep<Subscribable, Observable> {
  return (origin) => observable$((observer, signal) => {
    boundedSubscription(origin, signal, {
      next(val) {
        if (predicate(val)) {
          observer.next(val);
        }
      },
      error: observer.error,
      complete: observer.complete,
    });
  });
}
