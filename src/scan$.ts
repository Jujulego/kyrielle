import type { Observable, Subscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Apply reducer-like function to each emitted value, emitting each result.
 */
export function scan$<T, S>(cb: ScanCallback<T, S>): PipeStep<Subscribable<T>, Observable<S>> {
  return (origin: Subscribable<T>) => {
    let state: S | undefined = undefined;

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          state = cb(state, item);
          observer.next(state);
        },
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  };
}

// Types
export type ScanCallback<T, S> = (state: S | undefined, item: T) => S;