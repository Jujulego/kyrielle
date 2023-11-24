import { DataKey, DataMap } from '../data-map.js';

/**
 * Object emitting multiple events, by keys
 */
export interface Emitter<M extends DataMap = DataMap> {
  __emit_event_map?: M;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<const K extends DataKey<M>>(key: K, data: M[K]): void;
}
