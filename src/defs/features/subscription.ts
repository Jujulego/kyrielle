/**
 * Represents an active subscription to an observable
 */
export interface Subscription {
  /**
   * Cancels subscription
   */
  unsubscribe(): void;

  /**
   * Indicates if subscription is closed
   */
  readonly closed: boolean;
}