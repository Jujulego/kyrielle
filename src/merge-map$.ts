import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * For each value emitted by the origin, this step will call `fn`, then will subscribe to its result and re-emit each
 * emitted value.
 * @param fn
 *
 * @since 1.0.0
 */
export function mergeMap$<T, R>(fn: (item: T) => AnySubscribable<R>): PipeStep<AnySubscribable<T>, Observable<R>> {
  return (origin: AnySubscribable<T>) => {
    origin = extractSubscribable(origin);
    let completed = 1;

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          completed++;

          boundedSubscription(extractSubscribable(fn(item)), signal, {
            next: (it) => observer.next(it),
            error: (err) => observer.error(err),
            complete: () => {
              completed--;

              if (completed === 0) {
                observer.complete();
              }
            }
          });
        },
        error: (err) => observer.error(err),
        complete: () => {
          completed--;

          if (completed === 0) {
            observer.complete();
          }
        }
      });
    });
  };
}

