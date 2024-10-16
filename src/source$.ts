import assert from 'assert';
import type { Observer } from './types/inputs/Observer.js';
import type { Observable, SubscribeArgs } from './types/outputs/Observable.js';
import type { StrictObserver } from './types/outputs/StrictObserver.js';
import type { Subscription } from './types/outputs/Subscription.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

/**
 * Creates a source object, emitting any given data or error, until completion.
 *
 * @since 1.0.0
 */
export function source$<D>(): Source<D> {
  const observers = new Set<Observer<D>>();
  let isCompleted = false;

  // Build source
  const source = {
    [Symbol.observable ?? '@@observable']: () => source,
    next: (data: D) => {
      assert(!isCompleted, 'Completed source cannot emit data');

      for (const observer of observers) {
        observer.next(data);
      }
    },
    error: (err: unknown) => {
      assert(!isCompleted, 'Completed source cannot emit error');

      for (const observer of observers) {
        observer.error(err);
      }
    },
    complete: () => {
      assert(!isCompleted, 'Source is already completed');
      isCompleted = true;

      for (const observer of observers) {
        observer.complete();
      }

      observers.clear();
    },
    subscribe: (...args: SubscribeArgs<D>): Subscription => {
      assert(!isCompleted, 'Cannot subscribe to completed source');

      const observer = parseSubscribeArgs(args);
      const subscription = buildSubscription({
        onUnsubscribe: () => observers.delete(observer),
        isClosed: () => !observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);

      return subscription;
    },
    get isCompleted() {
      return isCompleted;
    }
  };

  return source as Source<D>;
}

// Types
/**
 * Observable object emitting given values.
 *
 * @since 1.0.0
 */
export interface Source<in out D = unknown> extends Observable<D>, Omit<StrictObserver<D>, 'start'> {
  /**
   * Indicates if source is completed.
   * A completed source does not emit anymore, as no subscription and refuse any new ones.
   *
   * @since 1.0.0
   */
  readonly isCompleted: boolean;
}