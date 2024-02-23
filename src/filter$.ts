import { Observable, Subscribable } from './defs/index.js';
import { observable$ } from './observable$.js';
import { PipeStep } from './pipe$.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<DO, DR extends DO>(predicate: (val: DO) => val is DR): PipeStep<Subscribable<DO>, Observable<DR>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<D>(predicate: (val: D) => boolean): PipeStep<Subscribable<D>, Observable<D>>;

export function filter$(predicate: (val: unknown) => boolean): PipeStep<Subscribable, Observable> {
  return (origin) => observable$((observer, signal) => {
    const subscription = origin.subscribe({
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

    signal.addEventListener('abort', subscription.unsubscribe, { once: true });
  });
}
