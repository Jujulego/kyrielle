import { Listenable, OutputDataRecord, Observable as Obs } from '../defs/index.js';
import { _multiplexer$ } from '../events/index.js';

// Types
export type RegistryFn<K extends string, O extends Obs> = (key: K) => O;
export type RegistryEventMap<K extends string, O extends Obs> = OutputDataRecord<K, O>;

/**
 * Manages a map of observable.
 * Will always return the same reference for a given key, and create it, if it does not exist, using given callback.
 *
 * @param fn origin builder, receives the asked key by argument
 */
export class ObservableRegistry<K extends string, R extends Obs> implements Listenable<RegistryEventMap<K, R>> {
  // Attributes
  private readonly _builder: RegistryFn<K, R>;
  private readonly _references = new Map<K, R>();
  private readonly _events = _multiplexer$<Record<K, R>>(this._references, (key) => this._getRef(key));

  // Constructor
  constructor(builder: RegistryFn<K, R>) {
    this._builder = builder;
  }

  // Methods
  private _getRef(key: K): R {
    let ref = this._references.get(key);

    if (!ref) {
      ref = this._builder(key);
      this._references.set(key, ref);
    }

    return ref;
  }

  readonly on = this._events.on;
  readonly off = this._events.off;
  readonly eventKeys = this._events.eventKeys;
  readonly clear = this._events.clear;

  /**
   * Returns a reference on the "key" element.
   *
   * @param key
   */
  ref(key: K): R;

  /**
   * Returns a reference on the "key" element.
   *
   * @param key
   * @param lazy if true will not create a reference if none exists
   */
  ref(key: K, lazy: false): R;

  /**
   * Returns a reference on the "key" element.
   *
   * @param key
   * @param lazy if true will not create a reference if none exists
   */
  ref(key: K, lazy: boolean): R | undefined;

  ref(key: K, lazy = false) {
    return lazy ? this._references.get(key) : this._getRef(key);
  }
}

/**
 * Manages a map of observables.
 * Will always return the same reference for a given key, and create it, if it does not exist, using given callback.
 *
 * @param fn origin builder, receives the asked key by argument
 */
export function registry$<K extends string, R extends Obs>(fn: RegistryFn<K, R>): ObservableRegistry<K, R> {
  return new ObservableRegistry(fn);
}