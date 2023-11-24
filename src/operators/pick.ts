import { DataKey, Receiver, KeyEmitter, Listenable, Listener, Observable, OffFn } from '../defs/index.js';

/**
 * Event sources that can be picked
 */
export type PickableOrigin = Listenable | KeyEmitter;

/**
 * Extracts keys pickable from given source
 */
export type PickableKey<S extends PickableOrigin> =
  | (S extends KeyEmitter<infer M> ? DataKey<M> : never)
  | (S extends Listenable<infer M> ? DataKey<M> : never);

/**
 * Builds a source from "K" key picked from "S" source
 */
export type PickedSource<S extends PickableOrigin, K extends PickableKey<S>> =
  & (S extends KeyEmitter<infer M> ? Receiver<M[K]> : unknown)
  & (S extends Listenable<infer M> ? Observable<M[K]> : unknown);

// Utils
function isEmitter(src: PickableOrigin): src is KeyEmitter {
  return 'emit' in src;
}

function isListenable(src: PickableOrigin): src is Listenable {
  return 'on' in src;
}

/**
 * Picks an event from a multiplexer to create a source.
 *
 * @param origin
 * @param key
 */
export function pick$<const O extends PickableOrigin, const K extends PickableKey<O>>(origin: O, key: K): PickedSource<O, K>;

export function pick$(origin: PickableOrigin, key: string) {
  let result = {};

  if (isEmitter(origin)) {
    result = Object.assign(result, {
      next: (data: unknown) => origin.emit(key, data),
    });
  }

  if (isListenable(origin)) {
    result = Object.assign(result, {
      subscribe: (listener: Listener<unknown>): OffFn => origin.on(key, listener),
      unsubscribe: (listener: Listener<unknown>) => origin.off(key, listener),
      clear: () => origin.clear(key),
    });
  }

  return result;
}
