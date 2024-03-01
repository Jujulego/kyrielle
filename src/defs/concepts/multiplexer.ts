import { Emitter, Listenable } from '../features/index.js';
import { Mapping } from '../mapping.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<IM extends Mapping = Mapping, OM extends Mapping = Mapping>
  extends Emitter<IM>, Listenable<OM> {}