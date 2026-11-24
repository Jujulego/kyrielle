import { observable$ } from './rx/observable$.js';
import type { Subscribable } from './features/subscribable.js';
import type { Unsubscribable } from './features/unsubscribable.js';
import type { Observable } from './rx/types/observable.js';

/**
 * Merges multiple observables into one.
 *
 * @since 1.0.0
 */
export function merge$<D>(...observables: Subscribable<D>[]): Observable<D> {
  return observable$((observer, signal) => {
    const subscriptions = new Set<Unsubscribable>();

    function handleAbort() {
      for (const sub of subscriptions) {
        sub.unsubscribe();
      }
    }

    for (const obs of observables) {
      let subscription: Unsubscribable;

      obs.subscribe({
        start: (sub) => {
          subscriptions.add(sub);
          subscription = sub;
        },
        next: (data) => observer.next(data),
        error: (err) => observer.error(err),
        complete: () => {
          subscriptions.delete(subscription);

          if (subscriptions.size === 0) {
            signal.removeEventListener('abort', handleAbort);
            observer.complete();
          }
        },
      });
    }

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}
