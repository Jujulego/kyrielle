import { Unsubscribable } from '../features/index.js';

/**
 * Represents an active subscription to an observable.
 */
export interface Subscription extends Unsubscribable, Disposable {
  /**
   * Indicates if subscription is closed
   */
  readonly closed: boolean;
}
