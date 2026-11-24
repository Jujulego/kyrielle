import type { Unsubscribable } from './unsubscribable.js';

/**
 * Object receiving data from an observable.
 *
 * @since 3.0.0
 * @see StrictObserver
 */
export interface MinimalObserver<D = unknown> {
  /**
   * Called at the start of a subscription with the generated subscription object
   * @param subscription
   */
  start?(subscription: Unsubscribable): void;

  /**
   * Called with each emitted value
   * @param data
   */
  next(data: D): void;

  /**
   * Called when an error occurs in the observable
   * @param err
   */
  error?(err: unknown): void;

  /**
   * Called when the observable completes. No other data or error will then be received.
   */
  complete?(): void;
}

export type PartialObserver<D = unknown> = MinimalObserver<D>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObserver<D = any> = MinimalObserver<D>;
