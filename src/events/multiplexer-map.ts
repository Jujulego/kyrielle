import { _multiplexer$ } from './bases/index.js';
import { AnyOrigin, InputDataRecord, OutputDataRecord, Multiplexer } from '../defs/index.js';

/**
 * Multiplexer map, automatically creating requested origins
 */
export interface MultiplexerMap<K extends string, O extends AnyOrigin> extends Multiplexer<InputDataRecord<K, O>, OutputDataRecord<K, O>> {
  /**
   * Mapped origins
   */
  readonly origins: ReadonlyMap<K, O>;
}

/**
 * Multiplexer map, automatically creating requested origins using given builder
 * @param builder
 */
export function multiplexerMap$<K extends string, O extends AnyOrigin>(builder: (key: K) => O): MultiplexerMap<K, O> {
  const origins = new Map<K, O>();

  function getSource(key: K): O {
    let src = origins.get(key);

    if (!src) {
      src = builder(key);
      origins.set(key, src);
    }

    return src;
  }

  return Object.assign(_multiplexer$<Record<K, O>>(origins, getSource), {
    get origins() {
      return origins;
    }
  });
}
