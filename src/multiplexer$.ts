import { _multiplexer, type _Multiplexer } from './bases/_multiplexer.js';
import type { AnyObserver } from './types/inputs/Observer.js';
import type { StrictEmitter } from './types/outputs/StrictEmitter.js';
import type { StrictListenable } from './types/outputs/StrictListenable.js';
import type { Subscribable } from './types/inputs/Subscribable.js';

/**
 * Builds a multiplexer routing events to origins within the given map
 * @param origins
 */
export function multiplexer$<M extends MultiplexerMapping>(origins: M): Multiplexer<M> {
  return _multiplexer<M>((key) => origins[key]);
}

// Types
export type MultiplexerMapping = Record<string,
  | AnyObserver
  | StrictEmitter
  | StrictListenable
  | Subscribable
>;

export type Multiplexer<M extends MultiplexerMapping = MultiplexerMapping> = _Multiplexer<M>;
