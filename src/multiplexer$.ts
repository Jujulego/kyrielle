import { _multiplexer, type Multiplexer } from './bases/_multiplexer.js';
import type { Mapping } from './types/mapping.js';

/**
 * Builds a multiplexer routing events to origins within the given map
 * @param origins
 */
export function multiplexer$<M extends Mapping>(origins: M): Multiplexer<M> {
  return _multiplexer<M>((key) => origins[key]);
}
