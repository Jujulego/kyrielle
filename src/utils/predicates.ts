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
  return isNonNullObject(value) && 'emit' in value && typeof value['emit'] === 'function';
}

/**
 * Tests if given value is a Listenable object
 */
export function isListenable<M extends Mapping = Mapping>(value: unknown): value is Listenable<M> {
  return isNonNullObject(value) && 'on' in value && typeof value['on'] === 'function';
}

/**
 * Tests if given value is a Mutable object
 */
export function isMutable<A = any, D = unknown>(value: unknown): value is Mutable<A, D> { // eslint-disable-line @typescript-eslint/no-explicit-any
  return isNonNullObject(value) && 'mutate' in value && typeof value['mutate'] === 'function';
}

/**
 * Tests if given value is a non-null object
 */
export function isNonNullObject(value: unknown): value is object {
  return typeof value === 'object' && value !== null;
}

/**
 * Tests if given value is an Observer object
 */
export function isObserver<T = unknown>(value: unknown): value is Observer<T> {
  return isNonNullObject(value) && 'next' in value && typeof value['next'] === 'function';
}

/**
 * Tests if given value is a PromiseLike object
 */
export function isPromise<T = unknown>(value: unknown): value is PromiseLike<T> {
  return isNonNullObject(value) && 'then' in value && typeof value['then'] === 'function';
}

/**
 * Tests if given value is a Readable object
 */
export function isReadable<D = unknown>(value: unknown): value is Readable<D> {
  return isNonNullObject(value) && 'read' in value && typeof value['read'] === 'function';
}

/**
 * Tests if given value is a Subscribable object
 */
export function isSubscribable<D = unknown>(value: unknown): value is Subscribable<D> {
  return isNonNullObject(value) && 'subscribe' in value && typeof value['subscribe'] === 'function';
}

/**
 * Tests if given value is an ObservableHolder object
 */
export function isSubscribableHolder<D = unknown>(value: unknown): value is SubscribableHolder<D> {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (Symbol.observable && Symbol.observable in value && typeof value[Symbol.observable] === 'function') {
    return true;
  }

  return '@@observable' in value && typeof value['@@observable'] === 'function';
}
