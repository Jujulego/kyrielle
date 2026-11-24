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
  start?: ObserverStartCallback | undefined;

  /**
   * Called with each emitted value
   * @param data
   */
  next: ObserverNextCallback<D>;

  /**
   * Called when an error occurs in the observable
   * @param err
   */
  error?: ObserverErrorCallback | undefined;

  /**
   * Called when the observable completes. No other data or error will then be received.
   */
  complete?: ObserverCompleteCallback | undefined;
}

export type ObserverStartCallback = (subscription: Unsubscribable) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObserverNextCallback<D = any> = (data: D) => void;
export type ObserverErrorCallback = (error: unknown) => void;
export type ObserverCompleteCallback = () => void;

export type PartialObserver<D = unknown> = Partial<MinimalObserver<D>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObserver<D = any> = PartialObserver<D>;
