import { _multiplexer$ } from './bases/index.js';
import { Multiplexer } from './concepts/index.js';
import { EmitEventMap, KeyPart, ListenEventMap, SourceMap } from './types/index.js';

/**
 * Multiplexer object with mapped sources
 */
export interface MultiplexerObj<M extends SourceMap> extends Multiplexer<EmitEventMap<M>, ListenEventMap<M>> {
  /**
   * Mapped sources
   */
  readonly sources: ReadonlyMap<keyof M & KeyPart, M[keyof M & KeyPart]>;
}

/**
 * Builds a multiplexer routing events to sources within the given map
 * @param map
 */
export function multiplexer$<const M extends SourceMap>(map: M): MultiplexerObj<M> {
  const sources = new Map(Object.entries(map) as [keyof M & KeyPart, M[keyof M & KeyPart]][]);

  function getSource<const K extends keyof M & KeyPart>(key: K): M[K] {
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