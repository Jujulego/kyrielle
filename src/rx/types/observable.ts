import type { Subscribable } from '../../features/subscribable.js';
import type { PartialObserver } from '../../features/minimal-observer.js';
import type { Subscription } from './subscription.js';

/**
 * Lazy and composable push based data source.
 *
 * @template D - Type of values emitted by the observable.
 *
 * @since 1.0.0
 */
export interface Observable<D = unknown> extends Subscribable<D> {
  [Symbol.observable](): Observable<D>;
  ['@@observable'](): Observable<D>;

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
   * @param onNext - Called with each emitted value.
   * @param onError - Called when an error occurs in the observable.
   * @param onComplete - Called when the observable completes. No other data or error will then be received.
   *
   * @since 1.0.0
   */
  subscribe(
    this: void,
    onNext: SubscribeOnNext<D>,
    onError?: SubscribeOnError,
    onComplete?: SubscribeOnComplete,
  ): Subscription;
}

/**
 * Callback invoked for each value emitted by an observable.
 *
 * @template D - Type of emitted values.
 */
export type SubscribeOnNext<in D = unknown> = (data: D) => void;

/**
 * Callback invoked when an observable reports an error.
 */
export type SubscribeOnError = (error: Error) => void;

/**
 * Callback invoked when an observable completes.
 */
export type SubscribeOnComplete = () => void;

/**
 * Positional subscription callbacks in `next`, `error`, `complete` order.
 *
 * @template D - Type of values passed to the `next` callback.
 */
export type SubscribeCallbacks<D = unknown> = [
  onNext: SubscribeOnNext<D>,
  onError?: SubscribeOnError,
  onComplete?: SubscribeOnComplete,
];

/**
 * Supported overload arguments for {@link Observable.subscribe}.
 *
 * @template D - Type of values observed.
 */
export type SubscribeArgs<D = unknown> = [] | [PartialObserver<D>] | SubscribeCallbacks<D>;
