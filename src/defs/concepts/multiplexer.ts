import { DataMap } from '../data-map.js';
import { KeyEmitter, Listenable } from '../features/index.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<EmitMap extends DataMap, ListenMap extends DataMap>
  extends KeyEmitter<EmitMap>, Listenable<ListenMap> {}
