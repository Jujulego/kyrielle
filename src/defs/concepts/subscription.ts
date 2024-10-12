import type { Unsubscribable } from '../features/index.js';

/**
 * Represents an active subscription to an observable.
 *
 * @deprecated
 */
export interface Subscription extends Unsubscribable, Disposable {
  /**
   * Indicates if subscription is closed
   */
  readonly closed: boolean;
}
