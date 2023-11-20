import { DataKey, DataMap } from '../data-map.js';
import { Observable } from '../features/index.js';
import { Multiplexer } from './multiplexer.js';

/**
 * Multiplexer that can be observed.
 * It's listeners would be called each time a child emits
 */
export interface Group<EmitMap extends DataMap, ListenMap extends DataMap>
  extends Observable<ListenMap[DataKey<ListenMap>]>, Multiplexer<EmitMap, ListenMap> {
  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: DataKey<ListenMap>): void;
}
