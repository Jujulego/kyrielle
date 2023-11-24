import { DataMap } from '../data-map.js';
import { Emitter, Listenable } from '../features/index.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<InputMap extends DataMap, OutputMap extends DataMap>
  extends Emitter<InputMap>, Listenable<OutputMap> {}
