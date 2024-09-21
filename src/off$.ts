import type { Unsubscribable } from './defs/index.js';

/**
 * Represents a subscription group
 */
export interface SubscriptionGroup extends Unsubscribable, Disposable {
  /**
   * Add given subscription to the group
   */
  add(...subscriptions: Unsubscribable[]): void;
}

/**
 * Builds a subscription group
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
