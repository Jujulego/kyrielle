import type { Deferrable } from './defs/index.js';

/**
 * Returns a readable always returning the same value.
 * @param value
 */
export function const$<D>(value: D): Deferrable<D> {
  return { defer: () => value };
}
