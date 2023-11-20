import { DataKey, EmittedDataMap, ListenedDataMap, Multiplexer, OriginMap } from '../defs/index.js';
import { _multiplexer$ } from './bases/index.js';

/**
 * Multiplexer object with mapped sources
 */
export interface MultiplexerObj<M extends OriginMap> extends Multiplexer<EmittedDataMap<M>, ListenedDataMap<M>> {
  /**
   * Mapped sources
   */
  readonly sources: ReadonlyMap<DataKey<M>, M[DataKey<M>]>;
}

/**
 * Builds a multiplexer routing events to sources within the given map
 * @param map
 */
export function multiplexer$<const M extends OriginMap>(map: M): MultiplexerObj<M> {
  const sources = new Map(Object.entries(map) as [DataKey<M>, M[DataKey<M>]][]);

  function getSource<const K extends DataKey<M>>(key: K): M[K] {
    const src = sources.get(key);

    if (!src) {
      throw new Error(`Child source ${key} not found`);
    }

    return src as M[K];
  }

  return Object.assign(_multiplexer$<M>(sources, getSource), {
    get sources() {
      return sources;
    }
  });
}
