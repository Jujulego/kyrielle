import type { Unsubscribable } from './unsubscribable.js';

/**
 * Object receiving data from an observable.
 *
 * @since 3.0.0
 * @see StrictObserver
 */
export interface PartialObserver<D = unknown> {
  /**
   * Called at the start of a subscription with the generated subscription object
   * @param subscription
   */
  readonly start?: ObserverStartCallback | undefined;

  /**
   * Called with each emitted value
   * @param data
   */
  readonly next?: ObserverNextCallback<D> | undefined;

  /**
   * Called when an error occurs in the observable
   * @param err
   */
  readonly error?: ObserverErrorCallback | undefined;

  /**
   * Called when the observable completes. No other data or error will then be received.
   */
  readonly complete?: ObserverCompleteCallback | undefined;
}

export type ObserverStartCallback = (subscription: Unsubscribable) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObserverNextCallback<D = any> = (data: D) => void;
export type ObserverErrorCallback = (error: unknown) => void;
export type ObserverCompleteCallback = () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObserver<D = any> = PartialObserver<D>;
