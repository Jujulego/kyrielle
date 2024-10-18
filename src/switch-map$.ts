import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { Subscribable } from './types/inputs/Subscribable.js';
import type { Unsubscribable } from './types/inputs/Unsubscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * For each value emitted by the origin, this step will call `fn`, then will subscribe to its result and re-emit each
 * emitted value. If a new value is emitted before the returned observable completes, the previous subscription will be
 * canceled.
 * @param fn
 *
 * @since 1.0.0
 */
export function switchMap$<T, R>(fn: (item: T) => Subscribable<R>): PipeStep<Subscribable<T>, Observable<R>> {
  return (origin: Subscribable<T>) => {
    let previous: Unsubscribable;
    let originCompleted = false;
    let childCompleted = false;

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          previous?.unsubscribe();
          previous = boundedSubscription(fn(item), signal, {
            next: (it) => observer.next(it),
            error: (err) => observer.error(err),
            complete: () => {
              childCompleted = true;

              if (originCompleted) {
                observer.complete();
              }
            }
          });
        },
        error: (err) => observer.error(err),
        complete: () => {
          originCompleted = true;

          if (childCompleted) {
            observer.complete();
          }
        }
      });
    });
  };
}

