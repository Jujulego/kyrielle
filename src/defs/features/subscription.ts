/**
 * Represents an active subscription to an observable.
 */
export interface Subscription {
  /**
   * Cancels subscription
   */
  unsubscribe(): void;
}

export interface KyrielleSubscription extends Subscription, Disposable {
  /**
   * Indicates if subscription is closed
   */
  readonly closed: boolean;
}
