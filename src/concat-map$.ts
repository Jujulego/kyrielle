import type { Observable, Subscribable } from './defs/index.js';
import { observable$, type SubscriberObserver } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

export function concatMap$<T, R>(fn: (item: T) => Subscribable<R>): PipeStep<Subscribable<T>, Observable<R>> {
  return (origin: Subscribable<T>) => {
    const queue: T[] = [];
    let childRunning = false;
    let originCompleted = false;

    function childSubscription(item: T, observer: SubscriberObserver<R>, signal: AbortSignal) {
      boundedSubscription(fn(item), signal, {
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
        next(item) {
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

