import {
  Mutable,
  Subscribable,
  Deferrable,
  SubscribableHolder,
  Observer,
  Mapping,
  Emitter,
  Listenable, type Refreshable
} from '../defs/index.js';
import { NonNullObject } from '../defs/utils.js';

/**
 * Tests if given value is an Emitter object
 */
export function isEmitter<M extends Mapping = Mapping>(value: unknown): value is Emitter<M> {
  return isNonNullObject(value) && hasMethod(value, 'emit');
}

/**
 * Tests if given value is a Listenable object
 */
export function isListenable<M extends Mapping = Mapping>(value: unknown): value is Listenable<M> {
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
export function isPartialObserver<T = unknown>(value: unknown): value is Partial<Observer<T>> {
  return isNonNullObject(value) && (hasMethod(value, 'next') || hasMethod(value, 'error') || hasMethod(value, 'complete'));
}

/**
 * Tests if given value is a minimal Observer object (with at least a next method)
 */
export function isMinimalObserver<T = unknown>(value: unknown): value is Pick<Observer<T>, 'next'> {
  return isNonNullObject(value) && hasMethod(value, 'next');
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
 * Tests if given value is a Refreshable object
 */
export function isRefreshable<D = unknown>(value: unknown): value is Refreshable<D> {
  return isNonNullObject(value) && hasMethod(value, 'refresh');
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

// Utils
function isNonNullObject(value: unknown): value is NonNullObject {
  return typeof value === 'object' && value !== null;
}

function hasMethod(value: NonNullObject, name: keyof NonNullObject): boolean {
  return name in value && typeof value[name] === 'function';
}
