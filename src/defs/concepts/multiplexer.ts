import { Emitter, Listenable } from '../features/index.js';
import { Mapping } from '../mapping.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<InputMap extends Mapping, OutputMap extends Mapping>
  extends Emitter<InputMap>, Listenable<OutputMap> {}