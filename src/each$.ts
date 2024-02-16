import { Observable } from './defs/index.js';
import { PipeStep } from './pipe$.js';
import { observable$ } from './observable$.js';

/**
 * Applies given function on every emitted values,
 * including values returned by read and mutate if present.
 */
export function each$<A, R>(fn: (arg: A) => R): PipeStep<Observable<A>, Observable<R>> {
  return (origin) => observable$((observer, signal) => {
    const subscription = origin.subscribe({
      next(val) {
        observer.next(fn(val));
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