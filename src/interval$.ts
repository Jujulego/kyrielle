import { observable$ } from './observable$.js';
import type { Observable } from './types/outputs/Observable.js';

/**
 * Utility building an observable emitting at a given period (in milliseconds)
 *
 * @since 1.0.0
 */
export function interval$(period: number): Observable<number> {
  return observable$<number>(({ next, complete }, signal) => {
    let count = 0;

    const id = setInterval(() => next(++count), period);

    signal?.addEventListener('abort', () => {
      clearInterval(id);
      complete();
    });
  });
}
