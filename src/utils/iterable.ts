import type { AnyIterable, Iterable } from '../types/inputs/Iterable.js';
import { isIterableHolder } from './predicates.js';

/**
 * Extract an iterable from given object
 * @param object
 */
export function extractIterable<D>(object: AnyIterable<D>): Iterable<D> {
  if (isIterableHolder(object)) {
    return object[Symbol.iterator]();
  }

  return object;
}
