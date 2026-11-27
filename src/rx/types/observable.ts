import type { Subscribable } from '../../features/subscribable.js';
import type {
  ObserverCompleteCallback,
  ObserverErrorCallback,
  ObserverNextCallback,
  PartialObserver,
} from '../../features/partial-observer.js';
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
    onNext: ObserverNextCallback<D>,
    onError?: ObserverErrorCallback,
    onComplete?: ObserverCompleteCallback,
  ): Subscription;
}

/**
 * Positional subscription callbacks in `next`, `error`, `complete` order.
 *
 * @template D - Type of values passed to the `next` callback.
 */
export type SubscribeCallbacks<D = unknown> = [
  onNext: ObserverNextCallback<D>,
  onError?: ObserverErrorCallback,
  onComplete?: ObserverCompleteCallback,
];

/**
 * Supported overload arguments for {@link Observable.subscribe}.
 *
 * @template D - Type of values observed.
 */
export type SubscribeArgs<D = unknown> = [] | [PartialObserver<D>] | SubscribeCallbacks<D>;
