import { Readable } from './defs/index.js';

/**
 * Returns a readable always returning the same value.
 * @param value
 */
export function const$<D>(value: D): Readable<D> {
  return { read: () => value };
}