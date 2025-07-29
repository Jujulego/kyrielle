import { _multiplexer, type Multiplexer } from './bases/_multiplexer.js';
import type { Observer } from './types/inputs/Observer.js';
import type { Subscribable } from './types/inputs/Subscribable.js';

/**
 * Builds a multiplexer routing events to origins within the given map, and an observable that emit every
 * value emitted by the given origins.
 */
export function group$<M extends GroupMapping>(origins: M): Multiplexer<M> {
  return _multiplexer<M>((key) => origins[key]);
}

// Types
export type GroupMapping = Record<string,
  | Observer<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  | Subscribable
>;
