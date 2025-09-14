import type { Extendable } from './types/inputs/Extendable.js';

/**
 * Adds item into given extendable.
 *
 * @since 2.6.0
 */
export function extend$<D>(extendable: Extendable<D>, item: D): void {
  if ('push' in extendable) {
    extendable.push(item);
  } else {
    extendable.add(item);
  }
}
