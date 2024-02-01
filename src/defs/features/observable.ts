import { Observer } from './observer.js';
import { Subscription } from './subscription.js';

import '../symbols.js';

/**
 * Lazy and composable push based data sources.
 */
export interface Observable<out D> {
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