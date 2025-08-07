import type {
  AnyAwaitableIterable,
  AnyIterable,
  MinimalAwaitableIterator,
  MinimalIterator
} from '../types/inputs/MinimalIterator.js';
import { isAsyncIterable, isIterable } from './predicates.js';

/**
 * Extract an iterator from given object
 * @param object
 */
export function extractIterator<D>(object: AnyIterable<D>): MinimalIterator<D> {
  if (isIterable<D>(object)) {
    return object[Symbol.iterator]();
  }

  return object;
}

/**
 * Extract an awaitable iterator from given object
 * @param object
 */
export function extractAwaitableIterator<D>(object: AnyAwaitableIterable<D>): MinimalAwaitableIterator<D> {
  if (isIterable<D>(object)) {
    return object[Symbol.iterator]();
  }

  if (isAsyncIterable<D>(object)) {
    return object[Symbol.asyncIterator]();
  }

  return object;
}
