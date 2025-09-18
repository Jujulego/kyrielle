import type { Extendable } from './types/inputs/Extendable.js';

/**
 * Adds item into given extendable.
 *
 * @since 2.6.0
 */
export function extend$<D, E extends Extendable<D>>(extendable: E, item: D): E {
  if ('push' in extendable) {
    extendable.push(item);
  } else {
    extendable.add(item);
  }

  return extendable;
}
