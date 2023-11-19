import { EventKey, EventListener, EventMap, OffFn } from '../types/index.js';

/**
 * Object registering listeners for multiple events
 */
export interface Listenable<M extends EventMap = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  __listen_event_map?: M;

  /**
   * Returns every listenable keys
   */
  eventKeys(): Iterable<EventKey<M>>;

  /**
   * Registers listener on given "key" event
   * @param key
   * @param listener
   */
  on<const K extends EventKey<M>>(key: K, listener: EventListener<M, K>): OffFn;

  /**
   * Unregisters listener from given "key" event
   * @param key
   * @param listener
   */
  off<const K extends EventKey<M>>(key: K, listener: EventListener<M, K>): void;

  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: EventKey<M>): void;
}
