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
   * @param listener
   */
  on<const K extends MappingKey<M>>(key: K, listener: (event: M[K]) => void): Unsubscribable;

  /**
   * Registers observer on given "key" event
   * @param key
   * @param observer
   */
  on<const K extends MappingKey<M>>(key: K, observer: Partial<Observer<M[K]>>): Unsubscribable;
}
