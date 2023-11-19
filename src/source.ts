import { Listener, Source } from './defs/index.js';

/**
 * Source object with registered listeners
 */
export interface SourceObj<D = unknown> extends Source<D> {
  /**
   * Registered listeners
   */
  readonly listeners: ReadonlySet<Listener<D>>;
}

/**
 * Builds a simple data source
 */
export function source$<D = unknown>(): SourceObj<D> {
  const listeners = new Set<Listener<D>>();

  return {
    next(data: D) {
      for (const listener of listeners) {
        listener(data);
      }
    },
    subscribe(listener: Listener<D>) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    unsubscribe(listener: Listener<D>) {
      listeners.delete(listener);
    },
    clear() {
      listeners.clear();
    },

    get listeners() {
      return listeners;
    },
  };
}