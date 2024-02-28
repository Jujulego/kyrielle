import { SubscribableHolder, Observer, Subscribable } from '../features/index.js';
import { Subscription } from './subscription.js';
import '../symbols.js';

/**
 * Lazy and composable push based data source.
 */
export interface Observable<out D = unknown> extends SubscribableHolder<D>, Subscribable<D> {
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
