import {
  Mutable,
  Subscribable,
  Readable,
  SubscribableHolder,
  Observer,
  Mapping,
  Emitter,
  Listenable
} from '../defs/index.js';

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
export function isPartialObserver<T = unknown>(value: unknown): value is Pick<Observer<T>, 'next'> {
  return isNonNullObject(value) && hasMethod(value, 'next');
}

/**
 * Tests if given value is a fully defined Observer object
 */
export function isObserver<T = unknown>(value: unknown): value is Observer<T> {
  return isPartialObserver(value) && hasMethod(value, 'error') && hasMethod(value, 'complete');
}

/**
 * Tests if given value is a PromiseLike object
 */
export function isPromise<T = unknown>(value: unknown): value is PromiseLike<T> {
  return isNonNullObject(value) && hasMethod(value, 'then');
}

/**
 * Tests if given value is a Readable object
 */
export function isReadable<D = unknown>(value: unknown): value is Readable<D> {
  return isNonNullObject(value) && hasMethod(value, 'read');
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
function isNonNullObject(value: unknown): value is Record<number | string | symbol, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasMethod(value: Record<number | string | symbol, unknown>, name: number | string | symbol): boolean {
  return name in value && typeof value[name] === 'function';
}
