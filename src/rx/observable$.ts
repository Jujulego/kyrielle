import type { Observable, SubscribeArgs } from '../types/outputs/Observable.js';
import type { StrictObserver } from '../types/outputs/StrictObserver.js';
import type { Subscription } from '../types/outputs/Subscription.js';
import type { Awaitable } from '../types/utils.js';
import { parseSubscribeArgs } from '../utils/subscribe.js';
import { buildSubscription } from '../utils/subscription.js';

/**
 * Creates an observable using fn's logic.
 * @param fn subscriber function
 *
 * @since 1.0.0
 */
export function observable$<D>(fn: SubscriberFn<D>): Observable<D> {
  const observers = new Set<StrictObserver<D>>();
  let state = State.Inactive;
  let controller: AbortController;

  // Subscriber
  const subscriber: SubscriberObserver<D> = {
    next: (data: D) => {
      for (const obs of observers) {
        obs.next(data);
      }
    },
    error: (err: unknown) => {
      for (const obs of observers) {
        obs.error(err);
      }
    },
    complete: () => {
      for (const obs of observers) {
        obs.complete();
      }

      state = State.Inactive;
      controller.abort();
      observers.clear();
    },
  };

  // Inner state
  async function activate() {
    try {
      state = State.Active;
      controller = new AbortController();

      await fn(subscriber, controller.signal);
    } catch (err: unknown) {
      state = State.Inactive;

      for (const obs of observers) {
        obs.error(err);
        obs.complete();
      }

      observers.clear();
    }
  }

  // Build observable
  const observable = {
    [Symbol.observable ?? '@@observable']: () => observable,
    subscribe: (...args: SubscribeArgs<D>): Subscription => {
      // Parse args
      const observer = parseSubscribeArgs(args);
      observers.add(observer);

      // Prepare subscription
      const subscription = buildSubscription({
        onUnsubscribe: () => {
          observers.delete(observer);

          if (observers.size === 0) {
            if (state === State.Active) {
              controller.abort();
            }

            state = State.Inactive;
          }
        },
        isClosed: () => !observers.has(observer),
      });
      observer.start?.(subscription);

      // Activate observable
      if (state === State.Inactive) {
        void activate();
      }

      return subscription;
    },
  } as Observable<D>;

  return observable;
}

// Types
export type SubscriberObserver<D = unknown> = Omit<StrictObserver<D>, 'start'>;
export type SubscriberFn<D> = (
  observer: SubscriberObserver<D>,
  signal: AbortSignal,
) => Awaitable<void>;

// Enum
const enum State {
  Inactive,
  Active,
}
