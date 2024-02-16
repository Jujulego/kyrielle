import { Observable } from './defs/index.js';
import { PipeStep } from './pipe$.js';
import { observable$ } from './observable$.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<DO, DR extends DO>(predicate: (val: DO) => val is DR): PipeStep<Observable<DO>, Observable<DR>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<D>(predicate: (val: D) => boolean): PipeStep<Observable<D>, Observable<D>>;

export function filter$(predicate: (val: unknown) => boolean): PipeStep {
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