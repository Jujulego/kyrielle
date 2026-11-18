import type { PartialObserver } from '../types/inputs/Observer.js';
import type { Unsubscribable } from '../types/inputs/Unsubscribable.js';

/**
 * Lazy and composable push-based data source.
 *
 * @since 1.0.0
 */
export interface Subscribable<D = unknown> {
  readonly __type?: D;

  /**
   * Subscribe to a subscribable using an observer.
   * @param observer
   *
   * @since 1.0.0
   */
  subscribe(observer: PartialObserver<D>): Unsubscribable;
}

/**
 * Object holding a {@link Subscribable} feature
 *
 * @since 1.0.0
 */
export interface SubscribableHolder<D = unknown> {
  [Symbol.observable](): Subscribable<D>;
}

export type AnySubscribable<D = unknown> = Subscribable<D> | SubscribableHolder<D>;

/**
 * Extracts observed value type of given subscribable
 */
export type SubscribableValue<T extends AnySubscribable> =
  T extends AnySubscribable<infer D> ? D : never;
