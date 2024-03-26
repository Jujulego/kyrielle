import { MappingKey, Mapping } from '../mapping.js';
import { Observer } from './observer.js';
import { Unsubscribable } from './unsubscribable.js';

/**
 * Object registering listeners for multiple events
 */
export interface Listenable<M extends Mapping = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  __listen_event_map?: M;

  /**
   * Registers listener on given "key" event
   * @param key
   * @param onNext Called with each emitted value
   * @param onError Called when an error occurs in the listenable.
   * @param onComplete Called when the listenable completes. No other data or error will then be received.
   */
  on<const K extends MappingKey<M>>(key: K, onNext: (event: M[K]) => void, onError?: (error: Error) => void, onComplete?: () => void): Unsubscribable;

  /**
   * Registers observer on given "key" event
   * @param key
   * @param observer
   */
  on<const K extends MappingKey<M>>(key: K, observer: Partial<Observer<M[K]>>): Unsubscribable;
}
