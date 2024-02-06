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
  complete(): never;
}

export type SubscriberFn<out D> = (observer: SubscriberObserver<D>, signal: AbortSignal) => Promise<void> | void;

export type SubscribeCallbacks<D> = [onNext: (data: D) => void, onError?: ((error: Error) => void) | undefined, onComplete?: (() => void) | undefined];

// Enum
const enum State {
  Inactive,
  Activating,
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
  const observer: SubscriberObserver<D> = {
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
      throw new SubscriberCompleted();
    }
  };

  // Inner state
  let state = State.Inactive;
  let controller: AbortController;

  async function activate() {
    if (state !== State.Activating) {
      return;
    }

    try {
      state = State.Active;
      controller = new AbortController();

      await fn(observer, controller.signal);
    } catch (err: unknown) {
      if (!(err instanceof SubscriberCompleted)) {
        for (const obs of observers) {
          obs.error(err);
        }
      }
    } finally {
      state = State.Inactive;

      for (const obs of observers) {
        obs.complete();
      }

      observers.clear();
    }
  }

  // Build observable
  const observable = {
    subscribe(...args: [Observer<D>] | SubscribeCallbacks<D>): Subscription {
      if (state === State.Inactive) {
        queueMicrotask(activate);
        state = State.Activating;
      }

      const observer = parseSubscribeArgs(args);
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
        isClosed: () => observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);

      return subscription;
    }
  };

  Object.assign(observable, { [Symbol.observable ?? Symbol.for('observable')]: observable });

  return observable as Observable<D>;
}
