import type { AnyIterable, MinimalIterator } from '../types/inputs/MinimalIterator.js';
import { isIterable } from './predicates.js';

/**
 * Extract an iterable from given object
 * @param object
 */
export function extractIterator<D>(object: AnyIterable<D>): MinimalIterator<D> {
  if (isIterable<D>(object)) {
    return object[Symbol.iterator]();
  }

  return object;
}
