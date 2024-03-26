/**
 * Represents an active subscription to an observable.
 */
export interface Unsubscribable {
  /**
   * Cancels subscription
   */
  unsubscribe(): void;
}