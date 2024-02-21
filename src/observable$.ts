import { Observable, Observer, Subscription } from './defs/index.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

// Types
export interface SubscriberObserver<in D = unknown> {
  /**
   * Emits given value
   * @param data
   */
  next(data: D): void;

  /**
   * Emits given error
   * @param err
   */
  error(err: unknown): void;

  /**
   * Completes the observable and closes all subscriptions
   */
  complete(): void;
}

export type SubscriberFn<out D> = (observer: SubscriberObserver<D>, signal: AbortSignal) => Promise<void> | void;

export type SubscribeCallbacks<D> = [onNext: (data: D) => void, onError?: ((error: Error) => void) | undefined, onComplete?: (() => void) | undefined];

// Enum
const enum State {
  Inactive,
  Active,
}

// Errors
export class SubscriberCompleted extends Error {
  constructor() {
    super('Subscriber completed');
  }
}

/**
 * Creates an observable using fn's logic.
 *
 * @param fn subscriber function
 */
export function observable$<D>(fn: SubscriberFn<D>): Observable<D> {
  const observers = new Set<Observer<D>>();

  // Subscriber
  const subscriber: SubscriberObserver<D> = {
    next(data: D) {
      for (const obs of observers) {
        obs.next(data);
      }
    },
    error(err: unknown) {
      for (const obs of observers) {
        obs.error(err);
      }
    },
    complete() {
      for (const obs of observers) {
        obs.complete();
      }

      observers.clear();
    }
  };

  // Inner state
  let state = State.Inactive;
  let controller: AbortController;

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
    subscribe(...args: [Observer<D>] | SubscribeCallbacks<D>): Subscription {
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
        isClosed: () => !observers.has(observer)
      });
      observer.start?.(subscription);

      // Activate observable
      if (state === State.Inactive) {
        activate();
      }

      return subscription;
    }
  };

  return observable;
}
