import { AsAwaitableAs, Awaitable, Mutable, Readable, RefIterableIterator } from '../defs/index.js';
import { iterMapper } from '../utils/iterator.js';
import { awaitedChain } from '../utils/index.js';

// Types
export interface RefMapSetOpts {
  /**
   * Signal to pass to ref mutate call (if called)
   */
  readonly signal?: AbortSignal;
}

/**
 * Matches origins that can be embedded in a RefMap
 */
export interface RefMapOrigin<in out D = unknown> extends Readable<Awaitable<D>>, Mutable<Awaitable<D>, D> {}

/**
 * Function used by RefMaps to build their inner refs
 */
export type RefMapFn<in K, in D, out R extends RefMapOrigin<D>> = (key: K, value: D) => R;

/**
 * Map storing data using mutable references.
 */
export class RefMap<K, D, R extends RefMapOrigin<D>> {
  // Attributes
  private readonly _builder: RefMapFn<K, D, R>;
  private readonly _references = new Map<K, R>();

  // Constructor
  constructor(builder: RefMapFn<K, D, R>) {
    this._builder = builder;
  }

  // Methods
  get(key: K): R | null {
    return this._references.get(key) ?? null;
  }

  has(key: K): boolean {
    return this._references.has(key);
  }

  set(key: K, value: D, opts: RefMapSetOpts = {}): R {
    let ref = this._references.get(key);

    if (!ref) {
      ref = this._builder(key, value);
      this._references.set(key, ref);
    } else {
      ref.mutate(value, opts.signal);
    }

    return ref;
  }

  delete(key: K): boolean {
    return this._references.delete(key);
  }

  clear(): void {
    return this._references.clear();
  }

  keys() {
    return this._references.keys();
  }

  references() {
    return this._references.values();
  }

  values(): RefIterableIterator<R>;
  values(): IterableIterator<Awaitable<D>> {
    return iterMapper(this._references.values(), (ref) => ref.read());
  }

  entries(): IterableIterator<AsAwaitableAs<ReturnType<R['read']>, readonly [K, D]>>;
  entries(): IterableIterator<Awaitable<readonly [K, D]>> {
    return iterMapper(
      this._references.entries(),
      ([key, ref]) => awaitedChain(ref.read(), (value) => [key, value] as const)
    );
  }

  // Properties
  get size(): number {
    return this._references.size;
  }
}

/**
 * Map storing data using mutable references.
 */
export function map$<K, D, R extends RefMapOrigin<D>>(fn: RefMapFn<K, D, R>): RefMap<K, D, R> {
  return new RefMap(fn);
}
