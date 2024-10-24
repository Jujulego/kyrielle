import type { Deferrable } from '../types/inputs/Deferrable.js';
import type { MinimalIterator } from '../types/inputs/MinimalIterator.js';
import type { Mutable } from '../types/inputs/Mutable.js';
import type { Observer, PartialObserver } from '../types/inputs/Observer.js';
import type { Subscribable, SubscribableHolder } from '../types/inputs/Subscribable.js';
import type { Mapping } from '../types/mapping.js';
import type { StrictEmitter } from '../types/outputs/StrictEmitter.js';
import type { StrictListenable } from '../types/outputs/StrictListenable.js';
import type { NonNullObject } from '../types/utils.js';

/**
 * Tests if given value is an Emitter object
 */
export function isEmitter<M extends Mapping = Mapping>(value: unknown): value is StrictEmitter<M> {
  return isNonNullObject(value) && hasMethod(value, 'emit');
}

/**
 * Tests if given value is a Listenable object
 */
export function isListenable<M extends Mapping = Mapping>(value: unknown): value is StrictListenable<M> {
  return isNonNullObject(value) && hasMethod(value, 'on');
}

/**
 * Tests if given value is a Mutable object
 */
export function isMutable<A = any, D = unknown>(value: unknown): value is Mutable<A, D> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return isNonNullObject(value) && hasMethod(value, 'mutate');
}

/**
 * Tests if given value is a partial Observer object
 */
export function isPartialObserver<T = unknown>(value: unknown): value is PartialObserver<T> {
  return isNonNullObject(value) && (hasMethod(value, 'next') || hasMethod(value, 'error') || hasMethod(value, 'complete'));
}

/**
 * Tests if given value is a minimal Observer object (with at least a next method)
 */
export function isMinimalObserver<T = unknown>(value: unknown): value is Pick<Observer<T>, 'next'> {
  return isNonNullObject(value) && hasMethod(value, 'next') && value.next.length > 0;
}

/**
 * Tests if given value is a fully defined Observer object
 */
export function isObserver<T = unknown>(value: unknown): value is Observer<T> {
  return isMinimalObserver(value) && hasMethod(value, 'error') && hasMethod(value, 'complete');
}

/**
 * Tests if given value is a PromiseLike object
 */
export function isPromise<T = unknown>(value: unknown): value is PromiseLike<T> {
  return isNonNullObject(value) && hasMethod(value, 'then');
}

/**
 * Tests if given value is a Deferrable object
 */
export function isDeferrable<D = unknown>(value: unknown): value is Deferrable<D> {
  return isNonNullObject(value) && hasMethod(value, 'defer');
}

/**
 * Tests if given value is a Subscribable object
 */
export function isSubscribable<D = unknown>(value: unknown): value is Subscribable<D> {
  return isNonNullObject(value) && hasMethod(value, 'subscribe');
}

/**
 * Tests if given value is an ObservableHolder object
 */
export function isSubscribableHolder<D = unknown>(value: unknown): value is SubscribableHolder<D> {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (Symbol.observable && hasMethod(value, Symbol.observable)) {
    return true;
  }

  return hasMethod(value, '@@observable');
}

/**
 * Tests if given value is an Iterator object
 */
export function isMinimalIterator<D = unknown>(value: unknown): value is MinimalIterator<D> {
  return isNonNullObject(value) && hasMethod(value, 'next') && value.next.length === 0;
}

/**
 * Tests if given value is an Iterable object
 */
export function isIterable<D = unknown>(value: unknown): value is Iterable<D> {
  return isNonNullObject(value) && hasMethod(value, Symbol.iterator);
}

// Utils
function isNonNullObject(value: unknown): value is NonNullObject {
  return typeof value === 'object' && value !== null;
}

function hasMethod<O extends NonNullObject, const K extends keyof O>(value: NonNullObject, name: K): value is O & Record<K, O[K] & ((...args: unknown[]) => unknown)> {
  return name in value && typeof value[name] === 'function';
}
