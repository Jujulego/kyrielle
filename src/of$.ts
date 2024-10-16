import { observable$ } from './observable$.js';
import type { Observable } from './types/outputs/Observable.js';

/**
 * Returns an observable emitting each value from given iterable.
 *
 * @since 1.0.0
 */
export function of$<T>(iterable: Iterable<T> | AsyncIterable<T>): Observable<T> {
  return observable$<T>(async (observer, signal) => {
    try {
      if (Symbol.iterator in iterable) {
        for (const item of iterable) {
          signal.throwIfAborted();
          observer.next(item);
        }
      } else {
        const iterator = iterable[Symbol.asyncIterator]();
        const abort = new Promise<never>((_, reject) => signal.addEventListener('abort', reject, { once: true }));

        while (!signal.aborted) {
          const result = await Promise.race([iterator.next(), abort]);
          if (result.done) break;

          observer.next(result.value);
        }
      }
    } catch(error) {
      observer.error(error);
    } finally {
      observer.complete();
    }
  });
}
