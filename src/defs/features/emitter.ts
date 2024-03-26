import { MappingKey, Mapping } from '../mapping.js';

/**
 * Object emitting multiple events, by keys
 */
export interface Emitter<M extends Mapping = Mapping> {
  __emit_event_map?: M;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   */
  emit<const K extends MappingKey<M>>(key: K, data: M[K]): void;
}
