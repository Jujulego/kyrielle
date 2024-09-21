import type { Observer, Subscribable, Subscription, Unsubscribable } from '../defs/index.js';

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
export function boundedSubscription<T>(observable: Subscribable<T>, signal: AbortSignal, observer: Observer<T>): Unsubscribable {
  let subscription: Unsubscribable;

  return observable.subscribe({
    start(sub) {
      subscription = sub;
      signal.addEventListener('abort', () => sub.unsubscribe(), { once: true });
      observer.start?.(sub);
    },
    next: (data) => observer.next(data),
    error: (err) => observer.error(err),
    complete() {
      signal.removeEventListener('abort', () => subscription.unsubscribe());
      observer.complete();
    }
  });
}
