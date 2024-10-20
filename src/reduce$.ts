import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Apply reducer-like function to each emitted value, emitting final result with origin completes.
 *
 * @since 1.0.0
 */
export function reduce$<T, S>(cb: ReduceCallback<T, S>, init: ReduceInit<S>): PipeStep<AnySubscribable<T>, Observable<S>> {
  return (origin: AnySubscribable<T>) => {
    let state = init();

    return observable$((observer, signal) => {
      boundedSubscription(extractSubscribable(origin), signal, {
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