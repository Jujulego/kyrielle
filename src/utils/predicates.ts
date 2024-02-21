import { Mutable, Observable, Readable } from '../defs/index.js';

/**
 * Tests if given value is a Mutable object
 */
export function isMutable<A = any, D = unknown>(value: unknown): value is Mutable<A, D> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return typeof value === 'object' && value !== null && 'mutate' in value && typeof value['mutate'] === 'function';
}

/**
 * Tests if given value is a Observable object
 */
export function isObservable<D = unknown>(value: unknown): value is Observable<D> {
  return typeof value === 'object' && value !== null && 'subscribe' in value && typeof value['subscribe'] === 'function';
}

/**
 * Tests if given value is a PromiseLike object
 */
export function isPromise<T = unknown>(value: unknown): value is PromiseLike<T> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

/**
 * Tests if given value is a Readable object
 */
export function isReadable<D = unknown>(value: unknown): value is Readable<D> {
  return typeof value === 'object' && value !== null && 'read' in value && typeof value['read'] === 'function';
}