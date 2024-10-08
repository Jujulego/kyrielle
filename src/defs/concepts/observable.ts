import type { SubscribableHolder, Observer, Subscribable } from '../features/index.js';
import type { Subscription } from './subscription.js';
import '../symbols.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SubscribeCallbacks<D = any> = [onNext: (data: D) => void, onError?: ((error: Error) => void) | undefined, onComplete?: (() => void) | undefined];

/**
 * Lazy and composable push based data source.
 */
export interface Observable<out D = unknown> extends SubscribableHolder<D>, Subscribable<D> {
  [Symbol.observable](): Observable<D>;

  /**
   * Subscribe to observable.
   */
  subscribe(): Subscription;

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
