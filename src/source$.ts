import assert from 'node:assert';

import { Observer, Source, Subscription } from './defs/index.js';
import { SubscribeCallbacks } from './observable$.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

/**
 * Creates a source object, emitting any given data or error, until completion.
 */
export function source$<D>(): Source<D> {
  const observers = new Set<Observer<D>>();
  let isCompleted = false;

  // Build source
  const source = {
    [Symbol.observable ?? '@@observable']: () => source,
    next(data: D) {
      assert(!isCompleted, 'Completed source cannot emit data');

      for (const observer of observers) {
        observer.next(data);
      }
    },
    error(err: unknown) {
      assert(!isCompleted, 'Completed source cannot emit error');

      for (const observer of observers) {
        observer.error(err);
      }
    },
    complete() {
      assert(!isCompleted, 'Source is already completed');
      isCompleted = true;

      for (const observer of observers) {
        observer.complete();
      }

      observers.clear();
    },
    subscribe(...args: [Observer<D>] | SubscribeCallbacks<D>): Subscription {
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

  return source;
}
