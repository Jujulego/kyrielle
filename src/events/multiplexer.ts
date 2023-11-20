import { DataKey, EmittedDataMap, ListenedDataMap, Multiplexer, OriginMap } from '../defs/index.js';
import { _multiplexer$ } from './bases/index.js';

/**
 * Multiplexer object with mapped origins
 */
export interface MultiplexerObj<M extends OriginMap> extends Multiplexer<EmittedDataMap<M>, ListenedDataMap<M>> {
  /**
   * Mapped origins
   */
  readonly origins: ReadonlyMap<DataKey<M>, M[DataKey<M>]>;
}

/**
 * Builds a multiplexer routing events to origins within the given map
 * @param map
 */
export function multiplexer$<const M extends OriginMap>(map: M): MultiplexerObj<M> {
  const origins = new Map(Object.entries(map) as [DataKey<M>, M[DataKey<M>]][]);

  function getOrigin<const K extends DataKey<M>>(key: K): M[K] {
    const src = origins.get(key);

    if (!src) {
      throw new Error(`Child origin ${key} not found`);
    }

    return src as M[K];
  }

  return Object.assign(_multiplexer$<M>(origins, getOrigin), {
    get origins() {
      return origins;
    }
  });
}
