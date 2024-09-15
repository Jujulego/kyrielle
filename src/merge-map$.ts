import type { Observable, Subscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

export function mergeMap$<T, R>(fn: (item: T) => Subscribable<R>): PipeStep<Subscribable<T>, Observable<R>> {
  return (origin: Subscribable<T>) => {
    let completed = 1;

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          completed++;

          boundedSubscription(fn(item), signal, {
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

