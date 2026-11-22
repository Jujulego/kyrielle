import type { Unsubscribable } from '../features/unsubscribable.js';

/**
 * Collection of subscriptions that can be canceled together.
 *
 * Use {@link add} to register additional subscriptions. Calling
 * {@link unsubscribe} cancels every subscription currently in the group.
 * It can also be used as a {@link Disposable} through `Symbol.dispose`.
 *
 * @since 1.0.0
 * @see Unsubscribable
 */
export interface SubscriptionGroup extends Unsubscribable, Disposable {
  /**
   * Adds subscriptions to this group.
   *
   * The added subscriptions will be canceled by the next call to
   * {@link unsubscribe}.
   *
   * @param subscriptions - Subscription handles to register.
   *
   * @since 1.0.0
   */
  add(this: void, ...subscriptions: Unsubscribable[]): void;

  /**
   * Cancels every subscription currently registered in this group.
   *
   * @since 1.0.0
   */
  unsubscribe(this: void): void;
}

/**
 * Creates a subscription group for cancelling multiple subscriptions together.
 *
 * @param subscriptions - Initial subscription handles to register.
 * @returns A subscription group that cancels all of its registered handles.
 *
 * @since 1.0.0
 * @see SubscriptionGroup
 * @see Unsubscribable
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
    },
  };
}
