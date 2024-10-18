import type { Unsubscribable } from './types/inputs/Unsubscribable.js';

/**
 * Represents a subscription group
 *
 * @since 1.0.0
 */
export interface SubscriptionGroup extends Unsubscribable, Disposable {
  /**
   * Add given subscription to the group
   *
   * @since 1.0.0
   */
  add(this: void, ...subscriptions: Unsubscribable[]): void;
}

/**
 * Builds a subscription group
 *
 * @since 1.0.0
 */
export function off$(...subscriptions: Unsubscribable[]): SubscriptionGroup {
  const store = new Set(subscriptions);

  function unsubscribe() {
    for (const sub of store) {
      sub.unsubscribe();
    }

    store.clear();
  }

  return {
    [Symbol.dispose ?? Symbol.for('Symbol.dispose')]: unsubscribe,
    unsubscribe,
    add: (...subscriptions: Unsubscribable[]) => {
      for (const sub of subscriptions) {
        store.add(sub);
      }
    }
  };
}
