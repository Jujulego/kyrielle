import { DataKey, DataMap, DataValue } from '../data-map.js';
import { Observable } from '../features/index.js';
import { Multiplexer } from './multiplexer.js';

/**
 * Multiplexer that can be observed.
 * It's listeners would be called each time a child emits
 */
export interface Group<InputMap extends DataMap, OutputMap extends DataMap>
  extends Observable<DataValue<OutputMap>>, Multiplexer<InputMap, OutputMap> {
  /**
   * Unregister all listeners, or only "key" listeners if given
   */
  clear(key?: DataKey<OutputMap>): void;
}
