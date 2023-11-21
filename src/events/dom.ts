import { DataMap, Listenable, Listener } from '../defs/index.js';
import { listenersMap } from '../utils/listeners-map.js';

export interface DomEmitter<M> {
  addEventListener<K extends keyof M>(type: K, listener: (event: M[K]) => void): void;
  removeEventListener<K extends keyof M>(type: K, listener: (event: M[K]) => void): void;
}

/**
 * Wraps an dom element
 * @param element
 */
export function dom$<M = HTMLElementEventMap>(element: DomEmitter<M>): Listenable<M & Record<never, never>>;

export function dom$(element: DomEmitter<DataMap>): Listenable {
  const listeners = listenersMap();

  function removeListener(key: string, listener: Listener) {
    element.removeEventListener(key, listener);
    listeners.delete(key, listener);
  }

  return {
    eventKeys: () => [],
    on(key: string, listener: Listener) {
      element.addEventListener(key, listener);
      listeners.add(key, listener);

      return () => removeListener(key, listener);
    },
    off: removeListener,
    clear(key?: string) {
      if (key) {
        const set = listeners.list(key);

        if (set) {
          for (const lst of set) {
            element.removeEventListener(key, lst);
          }

          listeners.clear(key);
        }
      } else {
        for (const [key, set] of listeners.entries()) {
          for (const lst of set) {
            element.removeEventListener(key, lst);
          }
        }

        listeners.clear();
      }
    }
  };
}
