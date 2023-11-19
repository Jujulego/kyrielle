import { KeyEmitter, Listenable } from '../features/index.js';
import { EventMap } from '../types/index.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<EmitMap extends EventMap, ListenMap extends EventMap>
  extends KeyEmitter<EmitMap>, Listenable<ListenMap> {}
