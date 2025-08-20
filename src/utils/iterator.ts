import type {
  AnyAsyncIterable,
  AnyAwaitableIterable,
  AnyIterable, MinimalAsyncIterator,
  MinimalAwaitableIterator,
  MinimalIterator
} from '../types/inputs/MinimalIterator.js';
import { isAsyncIterable, isIterable } from './predicates.js';

/**
 * Extract an iterator from given object
 *
 * @version 2.5.3
 */
export function extractIterator<D>(object: AnyIterable<D>): MinimalIterator<D> {
  if (isIterable<D>(object)) {
    return object[Symbol.iterator]();
  }

  return object;
}

/**
 * Extract an async iterator from given object
 *
 * @version 2.5.3
 */
export function extractAsyncIterator<D>(object: AnyAsyncIterable<D>): MinimalAsyncIterator<D> {
  if (isAsyncIterable<D>(object)) {
    return object[Symbol.asyncIterator]();
  }

  return object;
}

/**
 * Extract an awaitable iterator from given object
 *
 * @version 2.5.3
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
