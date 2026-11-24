import type { Subscribable } from '../features/subscribable.js';
import type { Unsubscribable } from '../features/unsubscribable.js';
import type { Observer } from '../rx/types/observer.js';
import type { Subscription } from '../rx/types/subscription.js';

export interface SubscriptionProps {
  /**
   * Called to close subscription (unsubscribe call or dispose).
   */
  readonly onUnsubscribe: () => void;

  /**
   * Getter to know if subscription is closed.
   */
  readonly isClosed: () => boolean;
}

/**
 * Builds a subscription object.
 */
export function buildSubscription({ onUnsubscribe, isClosed }: SubscriptionProps): Subscription {
  const subscription = {
    [Symbol.dispose ?? Symbol.for('Symbol.dispose')]: onUnsubscribe,
    unsubscribe: onUnsubscribe,
  };

  Object.defineProperty(subscription, 'closed', {
    get: isClosed,
    configurable: false,
    enumerable: true,
  });

  return subscription as Subscription;
}

/**
 * Subscribes to given observer, bounded to a signal.
 */
export function boundedSubscription<T>(
  observable: Subscribable<T>,
  signal: AbortSignal,
  observer: Observer<T>,
): Subscription {
  let internal: Subscription;
  let isClosed = false;

  const sub = observable.subscribe({
    start(sub) {
      internal = buildSubscription({
        onUnsubscribe: () => {
          isClosed = true;
          sub.unsubscribe();
        },
        isClosed: () => isClosed,
      });

      signal.addEventListener('abort', internal.unsubscribe, { once: true });
      observer.start?.(internal);
    },
    next: observer.next,
    error: observer.error,
    complete() {
      signal.removeEventListener('abort', internal.unsubscribe);
      isClosed = true;

      observer.complete();
    },
  });

  return buildSubscription({
    onUnsubscribe: () => {
      isClosed = true;
      sub.unsubscribe();
    },
    isClosed: () => isClosed,
  });
}

/**
 * Wraps an Unsubscribable object into a Subscription
 * @param unsub
 */
export function wrapUnsubscribable(unsub: Unsubscribable): Subscription {
  let isClosed = false;

  return buildSubscription({
    onUnsubscribe: () => {
      isClosed = true;
      unsub.unsubscribe();
    },
    isClosed: () => isClosed,
  });
}
