import { Observable, ObservedValue, Subscribable, type Unsubscribable } from './defs/index.js';
import { PredicateFn } from './defs/utils.js';
import { observable$ } from './observable$.js';
import { PipeStep } from './pipe$.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<O extends Subscribable, R extends ObservedValue<O>>(predicate: PredicateFn<ObservedValue<O>, R>): PipeStep<O, Observable<R>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<O extends Subscribable>(predicate: (val: ObservedValue<O>) => boolean): PipeStep<O, Observable<ObservedValue<O>>>;

export function filter$(predicate: (val: unknown) => boolean): PipeStep<Subscribable, Observable> {
  return (origin) => observable$((observer, signal) => {
    let subscription: Unsubscribable;

    origin.subscribe({
      start(sub) {
        subscription = sub;
        signal.addEventListener('abort', sub.unsubscribe, { once: true });
      },
      next(val) {
        if (predicate(val)) {
          observer.next(val);
        }
      },
      error: observer.error,
      complete() {
        signal.removeEventListener('abort', subscription.unsubscribe);
        observer.complete();
      }
    });
  });
}
