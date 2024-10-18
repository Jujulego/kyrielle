import type { PartialObserver } from './Observer.js';
import type { Unsubscribable } from './Unsubscribable.js';

/**
 * Lazy and composable push based data source.
 *
 * @since 1.0.0
 */
export interface Subscribable<out D = unknown> {
  __type?: D;

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
export interface SubscribableHolder<out D = unknown> {
  [Symbol.observable](): Subscribable<D>;
}

export type AnySubscribable<D = unknown> = Subscribable<D> | SubscribableHolder<D>;
export type SubscribableValue<T extends AnySubscribable> = T extends AnySubscribable<infer D> ? D : never;
