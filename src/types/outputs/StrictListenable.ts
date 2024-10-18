import type { PartialObserver } from '../inputs/Observer.js';
import type { Mapping, MappingKey } from '../mapping.js';
import type { SubscribeOnComplete, SubscribeOnError, SubscribeOnNext } from './Observable.js';
import type { Subscription } from './Subscription.js';

/**
 * Object registering listeners for multiple events
 *
 * @since 2.0.0
 */
export interface StrictListenable<M extends Mapping = Mapping> {
  __listen_event_map?: M;

  /**
   * Registers observer on given "key" event
   * @param key
   * @param observer
   *
   * @since 2.0.0
   */
  on<const K extends MappingKey<M>>(this: void, key: K, observer: PartialObserver<M[K]>): Subscription;

  /**
   * Registers listener on given "key" event
   * @param key
   * @param onNext Called with each emitted value
   * @param onError Called when an error occurs in the listenable.
   * @param onComplete Called when the listenable completes. No other data or error will then be received.
   *
   * @since 2.0.0
   */
  on<const K extends MappingKey<M>>(this: void, key: K, onNext: SubscribeOnNext<M[K]>, onError?: SubscribeOnError, onComplete?: SubscribeOnComplete): Subscription;
}

/**
 * Extract event map from a Listenable
 *
 * @since 2.0.0
 */
export type ListenEventMap<L extends StrictListenable> = L extends StrictListenable<infer M> ? M : never;
