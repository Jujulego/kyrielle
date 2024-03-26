import { Emitter, Listenable } from '../features/index.js';
import { InputMapping, Mapping, OutputMapping } from '../mapping.js';

/**
 * Object managing multiple events
 */
export interface Multiplexer<M extends Mapping = Mapping>
  extends Emitter<InputMapping<M>>, Listenable<OutputMapping<M>> {}