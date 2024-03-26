import { Subscription } from '../defs/index.js';

export interface SubscriptionProps {
  /**
   * Called to close subscription (unsubscribe call or dispose).
   */
  onUnsubscribe(): void;

  /**
   * Getter to know if subscription is closed.
   */
  isClosed(): boolean;
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
