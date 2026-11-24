import type { MinimalObserver } from '../../features/minimal-observer.js';
import type { Subscription } from './subscription.js';

/**
 * Object receiving data from an observable.
 *
 * @since 3.0.0
 * @see MinimalObserver
 * @see observer$
 */
export interface Observer<D = unknown> extends MinimalObserver<D> {
  /**
   * Called at the start of a subscription with the generated subscription object
   * @param subscription
   */
  start(this: void, subscription: Subscription): void;

  /**
   * Called with each emitted value
   * @param data
   */
  next(this: void, data: D): void;

  /**
   * Called when an error occurs in the observable
   * @param err
   */
  error(this: void, err: unknown): void;

  /**
   * Called when the observable completes. No other data or error will then be received.
   */
  complete(this: void): void;
}
