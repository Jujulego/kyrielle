import type { Unsubscribable } from '../inputs/Unsubscribable.js';

/**
 * Represents a subscription to an observable.
 *
 * @since 1.0.0
 * @see Unsubscribable
 */
export interface Subscription extends Unsubscribable, Disposable {
  /**
   * Unsubscribe subscription
   *
   * @since 1.0.0
   */
  unsubscribe(this: void): void;

  /**
   * Indicates if subscription is closed
   */
  readonly closed: boolean;
}
