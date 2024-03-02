import { Mapping, Multiplexer } from './defs/index.js';
import { _multiplexer } from './bases/_multiplexer.js';

/**
 * Builds a multiplexer routing events to origins within the given map
 * @param origins
 */
export function multiplexer$<M extends Mapping>(origins: M): Multiplexer<M> {
  return _multiplexer<M>((key) => origins[key]);
}