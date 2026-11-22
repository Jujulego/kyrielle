/**
 * Handle returned by a subscribable that can cancel an active subscription.
 *
 * Calling {@link unsubscribe} stops notifications from the subscription.
 * Repeated calls have no additional effect.
 *
 * @since 1.0.0
 * @see Subscription
 */
export interface Unsubscribable {
  /**
   * Cancels the subscription and prevents further notifications.
   *
   * Calling this method more than once has no additional effect.
   *
   * @since 1.0.0
   */
  unsubscribe(): void;
}
