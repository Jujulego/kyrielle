import { AnyOrigin, Emitter, KeyEmitter, Listenable, Observable } from '../defs/index.js';

/**
 * Origins that can be "lazyfied"
 */
export type LazyOrigin =
  & Partial<Emitter>
  & Partial<KeyEmitter>
  & Partial<Observable>
  & Partial<Listenable>;

/**
 * Removes all properties that are not in LazyOrigin
 */
export type Lazify<O extends AnyOrigin> = Pick<O, Extract<keyof O, keyof LazyOrigin>>;

/**
 * Defines a lazy source.
 * A lazy source will only be initialized on first access to one of it's source/emitter attribute.
 *
 * @param cb
 */
export function lazy$<O extends AnyOrigin>(cb: () => O): Lazify<O>;

export function lazy$(cb: () => AnyOrigin): LazyOrigin {
  let _origin: AnyOrigin | null = null;

  function load(): AnyOrigin {
    _origin ??= cb();
    return _origin;
  }

  return {
    get emit() {
      replaceProp(this, 'emit', load());
      return this.emit;
    },
    get next() {
      replaceProp(this, 'next', load());
      return this.next;
    },
    get on() {
      replaceProp(this, 'on', load());
      return this.on;
    },
    get off() {
      replaceProp(this, 'off', load());
      return this.off;
    },
    get subscribe() {
      replaceProp(this, 'subscribe', load());
      return this.subscribe;
    },
    get unsubscribe() {
      replaceProp(this, 'unsubscribe', load());
      return this.unsubscribe;
    },
    get clear() {
      replaceProp(this, 'clear', load());
      return this.clear;
    },
  } as LazyOrigin;
}

// Utils
function replaceProp<P extends keyof LazyOrigin>(obj: LazyOrigin, prop: P, org: AnyOrigin): void {
  delete obj[prop];

  if (prop in org) {
    obj[prop] = (org as LazyOrigin)[prop];
  }
}
