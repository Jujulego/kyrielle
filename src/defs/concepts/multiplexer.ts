import { DataMap } from '../data-map.js';
import { KeyEmitter, Listenable } from '../features/index.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<InputMap extends DataMap, OutputMap extends DataMap>
  extends KeyEmitter<InputMap>, Listenable<OutputMap> {}
