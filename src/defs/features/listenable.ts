import { DataKey, DataListener, DataMap, DataValue } from '../data-map.js';
import { Unsubscribable } from '../subscription.js';
import { Observer } from './observer.js';

/**
 * Object registering listeners for multiple events
 */
export interface Listenable<M extends DataMap = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  __listen_event_map?: M;

  /**
   * Registers listener on given "key" event
   * @param key
   * @param listener
   */
  on<const K extends DataKey<M>>(key: K, listener: DataListener<M, K>): Unsubscribable;

  /**
   * Registers observer on given "key" event
   * @param key
   * @param observer
   */
  on<const K extends DataKey<M>>(key: K, observer: Partial<Observer<DataValue<M, K>>>): Unsubscribable;
}
