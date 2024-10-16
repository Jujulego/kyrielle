import type { Unsubscribable } from './Unsubscribable.js';

/**
 * Object receiving data from an observable.
 *
 * @since 1.0.0
 * @see StrictObserver
 */
export interface Observer<in D = unknown> {
  /**
   * Called at the start of a subscription with the generated subscription object
   * @param subscription
   *
   * @since 1.0.0
   */
  start?(subscription: Unsubscribable): void;

  /**
   * Called with each emitted value
   * @param data
   *
   * @since 1.0.0
   */
  next(data: D): void;

  /**
   * Called when an error occurs in the observable
   * @param err
   *
   * @since 1.0.0
   */
  error(err: unknown): void;

  /**
   * Called when the observable completes. No other data or error will then be received.
   *
   * @since 1.0.0
   */
  complete(): void;
}

export type PartialObserver<in D = unknown> = { [K in keyof Observer<D>]?: Observer<D>[K] | undefined };
