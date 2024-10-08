import type { Observable, Subscribable, Unsubscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

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

