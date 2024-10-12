/**
 * Represents a subscription that can be "unsubscribed".
 *
 * @since 1.0.0
 * @see Subscription
 */
export interface Unsubscribable {
  /**
   * Unsubscribe subscription
   *
   * @since 1.0.0
   */
  unsubscribe(): void;
}
