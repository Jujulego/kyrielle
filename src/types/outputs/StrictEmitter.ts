import type { Mapping, MappingKey } from '../mapping.js';

/**
 * Object emitting events
 *
 * @since 2.0.0
 */
export interface StrictEmitter<M extends Mapping = Mapping> {
  __emit_event_map?: M;

  /**
   * Emits "key" event, with given data
   * @param key
   * @param data
   *
   * @since 2.0.0
   */
  emit<const K extends MappingKey<M>>(this: void, key: K, data: M[K]): void;
}