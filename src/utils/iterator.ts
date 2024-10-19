import type { AnyIterable } from '../types/inputs/Iterable.js';
import { isIterable } from './predicates.js';

/**
 * Extract an iterable from given object
 * @param object
 */
export function extractIterator<D>(object: AnyIterable<D>): Iterator<D> {
  if (isIterable<D>(object)) {
    return object[Symbol.iterator]();
  }

  return object;
}
