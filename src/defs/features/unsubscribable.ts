/**
 * Represents an active subscription to an observable.
 *
 * @deprecated
 */
export interface Unsubscribable {
  /**
   * Cancels subscription
   */
  unsubscribe(): void;
}
