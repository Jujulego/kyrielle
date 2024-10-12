import type { Observer } from '../inputs/Observer.js';
import type { Subscription } from './Subscription.js';

/**
 * Object receiving data from an observable.
 *
 * @since 1.1.0
 * @see Observer
 * @see observer$
 */
export interface StrictObserver<in D = unknown> extends Observer<D> {
  /**
   * Called at the start of a subscription with the generated subscription object
   * @param subscription
   *
   * @since 1.1.0
   */
  start?(this: void, subscription: Subscription): void;

  /**
   * Called with each emitted value
   * @param data
   *
   * @since 1.1.0
   */
  next(this: void, data: D): void;

  /**
   * Called when an error occurs in the observable
   * @param err
   *
   * @since 1.1.0
   */
  error(this: void, err: unknown): void;

  /**
   * Called when the observable completes. No other data or error will then be received.
   *
   * @since 1.1.0
   */
  complete(this: void, ): void;
}
