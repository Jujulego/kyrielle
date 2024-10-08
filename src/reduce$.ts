import type { Observable, Subscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Apply reducer-like function to each emitted value, emitting final result with origin completes.
 */
export function reduce$<T, S>(cb: ReduceCallback<T, S>, init: ReduceInit<S>): PipeStep<Subscribable<T>, Observable<S>> {
  return (origin: Subscribable<T>) => {
    let state = init();

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          state = cb(state, item);
        },
        error: (err) => observer.error(err),
        complete: () => {
          observer.next(state);
          observer.complete();
        },
      });
    });
  };
}

// Types
export type ReduceCallback<T, S> = (state: S, item: T) => S;
export type ReduceInit<S> = () => S;