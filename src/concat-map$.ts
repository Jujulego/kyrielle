import { observable$, type SubscriberObserver } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * For each value emitted by the origin, this step will call `fn`, then will subscribe to its result and re-emit each
 * emitted value, until this "inner" subscription completes. All value emitted by the origin will be queued, and
 * processed in order
 * @param fn
 *
 * @since 1.0.0
 */
export function concatMap$<T, R>(fn: (item: T) => AnySubscribable<R>): PipeStep<AnySubscribable<T>, Observable<R>> {
  return (origin: AnySubscribable<T>) => {
    origin = extractSubscribable(origin);
    const queue: T[] = [];
    let childRunning = false;
    let originCompleted = false;

    function childSubscription(item: T, observer: SubscriberObserver<R>, signal: AbortSignal) {
      boundedSubscription(extractSubscribable(fn(item)), signal, {
        next: (it) => observer.next(it),
        error: (err) => observer.error(err),
        complete: () => {
          const next = queue.pop();

          if (next) {
            childSubscription(next, observer, signal);
          } else {
            childRunning = false;

            if (originCompleted) {
              observer.complete();
            }
          }
        }
      });
    }

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next: (item) => {
          if (!childRunning) {
            childRunning = true;
            childSubscription(item, observer, signal);
          } else {
            queue.unshift(item);
          }
        },
        error: (err) => observer.error(err),
        complete: () => {
          originCompleted = true;

          if (!childRunning) {
            observer.complete();
          }
        }
      });
    });
  };
}

