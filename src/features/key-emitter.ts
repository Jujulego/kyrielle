import { EventData, EventKey, EventMap } from '../types/index.js';

/**
 * Object emitting multiple events, by keys
 */
export interface KeyEmitter<M extends EventMap = EventMap> {
  __emit_event_map?: M;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<const K extends EventKey<M>>(key: K, data: EventData<M, K>): void;
}
