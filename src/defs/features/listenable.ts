import { OffFn } from '../common.js';
import { DataKey, DataListener, DataMap } from '../data-map.js';

/**
 * Object registering listeners for multiple events
 */
export interface Listenable<M extends DataMap = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  __listen_event_map?: M;

  /**
   * Returns every listenable keys
   */
  eventKeys(): Iterable<DataKey<M>>;

  /**
   * Registers listener on given "key" event
   * @param key
   * @param listener
   */
  on<const K extends DataKey<M>>(key: K, listener: DataListener<M, K>): OffFn;

  /**
   * Unregisters listener from given "key" event
   * @param key
   * @param listener
   */
  off<const K extends DataKey<M>>(key: K, listener: DataListener<M, K>): void;

  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: DataKey<M>): void;
}
