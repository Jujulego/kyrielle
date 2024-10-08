import type { Observer } from './observer.js';
import type { Unsubscribable } from './unsubscribable.js';
import '../symbols.js';

/**
 * Lazy and composable push based data source.
 */
export interface Subscribable<out D = unknown> {
  __type?: D;

  /**
   * Subscribe to observable using an observer.
   * @param observer
   */
  subscribe(observer: Partial<Observer<D>>): Unsubscribable;
}

/**
 * Object that can be observed using `[Symbol.observable]` method.
 */
export interface SubscribableHolder<out D = unknown> {
  [Symbol.observable](): Subscribable<D>;
}
