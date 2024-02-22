import { Observer } from './observer.js';
import { Subscription, Unsubscribable } from '../subscription.js';

import '../symbols.js';

/**
 * Object that can be observed using `[Symbol.observable]` method.
 */
export interface ObservableHolder<out D = unknown> {
  [Symbol.observable](): Subscribable<D>;
}

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
 * Lazy and composable push based data source.
 */
export interface Observable<out D = unknown> extends ObservableHolder<D>, Subscribable<D> {
  [Symbol.observable](): Observable<D>;

  /**
   * Subscribe to observable using an observer.
   * @param observer
   */
  subscribe(observer: Partial<Observer<D>>): Subscription;

  /**
   * Subscribe to observable using callbacks.
   * @param onNext Called with each emitted value
   * @param onError Called when an error occurs in the observable
   * @param onComplete Called when the observable completes. No other data or error will then be received.
   */
  subscribe(onNext: (data: D) => void, onError?: (error: Error) => void, onComplete?: () => void): Subscription;
}

/**
 * Extract value type emitted by observable.
 */
export type ObservedValue<O extends Subscribable> = O extends Subscribable<infer D> ? D : never;
