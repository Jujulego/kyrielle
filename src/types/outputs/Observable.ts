import type { PartialObserver } from '../inputs/Observer.js';
import type { Subscribable, SubscribableHolder } from '../inputs/Subscribable.js';
import type { Subscription } from './Subscription.js';

/**
 * Lazy and composable push based data source.
 *
 * @since 1.0.0
 */
export interface Observable<out D = unknown> extends Subscribable<D>, SubscribableHolder<D> {
   [Symbol.observable](): Observable<D>;

  /**
   * Subscribe to the observable.
   *
   * @since 1.0.0
   */
   subscribe(this: void): Subscription;

  /**
   * Subscribe to observable using an observer.
   * @param observer
   *
   * @since 1.0.0
   */
   subscribe(this: void, observer: PartialObserver<D>): Subscription;

  /**
   * Subscribe to observable using callbacks.
   * @param onNext called with each emitted value
   * @param onError called when an error occurs in the observable
   * @param onComplete called when the observable completes. No other data or error will then be received.
   *
   * @since 1.0.0
   */
   subscribe(this: void, onNext: SubscribeOnNext<D>, onError?: SubscribeOnError, onComplete?: SubscribeOnComplete): Subscription;
}

export type SubscribeOnNext<in D = unknown> = (data: D) => void;
export type SubscribeOnError = (error: Error) => void;
export type SubscribeOnComplete = () => void;

export type SubscribeCallbacks<in D = unknown> = [onNext: SubscribeOnNext<D>, onError?: SubscribeOnError, onComplete?: SubscribeOnComplete];
export type SubscribeArgs<D = unknown> = [] | [PartialObserver<D>] | SubscribeCallbacks<D>;
