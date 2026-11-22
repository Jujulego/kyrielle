import type { PartialObserver } from '../types/inputs/Observer.js';
import type { Unsubscribable } from './unsubscribable.js';

/**
 * Minimal push-based data source contract.
 *
 * A subscribable emits values of type `D` to a partial observer and returns an
 * object that can cancel the subscription.
 *
 * @template D - Type of values emitted by the subscribable.
 *
 * @since 1.0.0
 * @see ObservableProtocol
 * @see AnySubscribable
 * @see SubscribableValue
 */
export interface Subscribable<D = unknown> {
  /**
   * Phantom property used to retain the emitted value type.
   */
  readonly __type?: D;

  /**
   * Subscribe to a subscribable using an observer.
   *
   * @param observer - Observer notified of values, errors, and completion.
   * @returns A handle that can stop the subscription.
   *
   * @since 1.0.0
   */
  subscribe(observer: PartialObserver<D>): Unsubscribable;
}

/**
 * Object implementing the observable interop protocol.
 *
 * Calling `[Symbol.observable]()` returns the underlying {@link Subscribable}.
 * The method falls back to `@@observable` at runtime for environments that do
 * not provide `Symbol.observable`.
 *
 * @template D - Type of values emitted by the held subscribable.
 *
 * @since 1.0.0
 * @see Subscribable
 * @see AnySubscribable
 * @see SubscribableValue
 */
export interface ObservableProtocol<D = unknown> {
  [Symbol.observable](): Subscribable<D>;
}

/**
 * A subscribable or an object holding a subscribable through the observable
 * interop protocol.
 *
 * @template D - Type of values emitted by the subscribable.
 *
 * @since 1.0.0
 * @see Subscribable
 * @see ObservableProtocol
 */
export type AnySubscribable<D = unknown> = Subscribable<D> | ObservableProtocol<D>;

/**
 * Extracts the value type emitted by a subscribable or subscribable holder.
 *
 * @template T - Subscribable or subscribable holder to inspect.
 *
 * @since 1.0.0
 * @see Subscribable
 * @see ObservableProtocol
 * @see AnySubscribable
 */
export type SubscribableValue<T extends AnySubscribable> =
  T extends AnySubscribable<infer D> ? D : never;
