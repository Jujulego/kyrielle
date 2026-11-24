import type { Observable, SubscribeArgs } from './types/observable.js';
import type { StrictObserver } from '../types/outputs/StrictObserver.js';
import type { Subscription } from '../types/outputs/Subscription.js';
import type { Awaitable } from '../types/utils.js';
import { parseSubscribeArgs } from '../utils/subscribe.js';
import { buildSubscription } from '../utils/subscription.js';

const enum State {
  Inactive,
  Active,
}

/**
 * Creates a lazy observable backed by a subscriber function.
 *
 * The function is called when the first observer subscribes. While it is
 * active, new observers share the same execution. The provided signal is
 * aborted when the last observer unsubscribes or when the execution completes.
 * Call `observer.complete()` to complete the current execution; returning from
 * the subscriber function alone does not complete the observable.
 *
 * @template D - Type of values emitted by the observable.
 * @param fn - Function that produces values for the active subscribers.
 * @returns An observable that starts its subscriber function on demand.
 *
 * @since 1.0.0
 * @see SubscriberFn
 * @see SubscriberObserver
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
    ['@@observable']: () => observable,
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

/**
 * Observer interface provided to a {@link SubscriberFn}.
 *
 * Its `next`, `error`, and `complete` calls are forwarded to the observable's
 * current subscribers. It omits `start`, which belongs to each downstream
 * subscription.
 *
 * @template D - Type of values emitted by the subscriber function.
 *
 * @since 1.0.0
 * @see SubscriberFn
 */
export type SubscriberObserver<D = unknown> = Omit<StrictObserver<D>, 'start'>;

/**
 * Function that produces values for an {@link observable$} instance.
 *
 * It may run synchronously or asynchronously. Use the supplied
 * {@link SubscriberObserver} to emit values, report errors, or complete the
 * observable. The {@link AbortSignal} is aborted after the last downstream
 * subscriber unsubscribes or when the observable is completed. Resolving the
 * function does not complete the observable; call `observer.complete()` to
 * signal completion.
 *
 * @template D - Type of values emitted by the function.
 * @param observer - Methods for emitting values and notifying subscribers.
 * @param signal - Signal indicating that there are no longer active subscribers.
 * @returns A void or promise-like void result.
 *
 * @since 1.0.0
 * @see observable$
 * @see SubscriberObserver
 */
export type SubscriberFn<D> = (
  observer: SubscriberObserver<D>,
  signal: AbortSignal,
) => Awaitable<void>;
