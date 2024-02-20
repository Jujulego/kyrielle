import { Observer } from './observer.js';
import { KyrielleSubscription, Subscription } from './subscription.js';

import '../symbols.js';

/**
 * Lazy and composable push based data source.
 */
export interface Observable<out D = unknown> {
  [Symbol.observable]: Observable<D>;

  /**
   * Subscribe to observable using an observer.
   * @param observer
   */
  subscribe(observer: Observer<D>): Subscription;

  /**
   * Subscribe to observable using callbacks.
   * @param onNext Called with each emitted value
   * @param onError Called when an error occurs in the observable
   * @param onComplete Called when the observable completes. No other data or error will then be received.
   */
  subscribe(onNext: (data: D) => void, onError?: (error: Error) => void, onComplete?: () => void): Subscription;
}

export interface KyrielleObservable<out D = unknown> extends Observable<D> {
  [Symbol.observable]: KyrielleObservable<D>;

  /**
   * Subscribe to observable using an observer.
   * @param observer
   */
  subscribe(observer: Observer<D>): KyrielleSubscription;

  /**
   * Subscribe to observable using callbacks.
   * @param onNext Called with each emitted value
   * @param onError Called when an error occurs in the observable
   * @param onComplete Called when the observable completes. No other data or error will then be received.
   */
  subscribe(onNext: (data: D) => void, onError?: (error: Error) => void, onComplete?: () => void): KyrielleSubscription;
}

/**
 * Extract value type emitted by observable.
 */
export type ObservedValue<O extends Observable> = O extends Observable<infer D> ? D : never;
