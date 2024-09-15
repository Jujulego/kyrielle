import type { Observable, Subscribable, Unsubscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { boundedSubscription } from './utils/subscription.js';

export function switchMap$<T, R>(fn: (item: T) => Subscribable<R>): PipeStep<Subscribable<T>, Observable<R>> {
  return (origin: Subscribable<T>) => {
    let previous: Unsubscribable;

    return observable$((observer, signal) => {
      boundedSubscription(origin, signal, {
        next(item) {
          previous?.unsubscribe();
          previous = fn(item).subscribe(observer);
        },
        error: (err) => observer.error(err),
        complete: () => {}
      });
    });
  };
}

