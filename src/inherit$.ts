import { type _Multiplexer, _multiplexer, type MultiplexerUtils } from './bases/_multiplexer.js';
import type { EmptyMapping, OverrideMapping } from './types/mapping.js';

/**
 * Builds a multiplexer by combining multiple listenable.
 *
 * @since 2.4.0
 */
export function inherit$<const A extends MultiplexerUtils[]>(...multiplexers: A): Inherit<A> {
  multiplexers.reverse();

  return _multiplexer((key) => {
    for (const multiplexer of multiplexers) {
      const origin = multiplexer.getOrigin(key);

      if (origin) {
        return origin;
      }
    }
  });
}

// Type
export interface Inherit<A extends MultiplexerUtils[]> extends _Multiplexer<_InheritedMapping<A>> {}

type _InheritedMapping<A extends MultiplexerUtils[]> = A extends [MultiplexerUtils<infer M>, ...(infer R extends MultiplexerUtils[])]
  ? OverrideMapping<M, _InheritedMapping<R>>
  : EmptyMapping;
