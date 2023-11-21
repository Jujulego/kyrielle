import { AnyOrigin, Listenable, Observable, Listener, OffFn } from '../defs/index.js';
import { off$ } from '../subscriptions/index.js';
import { listenersMap } from '../utils/listeners-map.js';

/**
 * Origins that can be dynamized
 */
export type DynamicOrigin =
  & Partial<Observable>
  & Partial<Listenable>;

/**
 * Removes all properties that are not in DynamicOrigin
 */
export type Dynamify<S extends Listenable | Observable> = Pick<S, Extract<keyof S, keyof DynamicOrigin>>;

function dynamicWarn(key?: string) {
  const type = key ? `"${key}" event listeners` : 'subscribers';
  console.warn(`dynamic origin has registered some ${type} but current origin does not support it`);
}

/**
 * Defines a dynamic source.
 * @param origin
 */
export function dynamic$<S extends Listenable | Observable>(origin: Observable<S>): Dynamify<S>;

export function dynamic$(origin: Observable<Listenable | Observable>): DynamicOrigin {
  const listeners = listenersMap();
  let current: AnyOrigin | null = null;
  let off = off$();

  // Utils
  function register(key: string, set: Set<Listener>) {
    if (!current) {
      return;
    }

    const listener = (event: unknown) => {
      for (const lst of set) {
        lst(event);
      }
    };

    if (key && 'on' in current) {
      off.add(
        current.on(key, listener)
      );
    } else if (!key && 'subscribe' in current) {
      off.add(
        current.subscribe(listener)
      );
    } else {
      dynamicWarn(key);
    }
  }

  function addListener(key: string, listener: Listener): OffFn {
    const [set, isNew] = listeners.add(key, listener);

    if (isNew) {
      register(key, set);
    }

    return () => set.delete(listener);
  }

  function removeListener(key: string, listener: Listener) {
    listeners.delete(key, listener);
  }

  // Listen origin
  origin.subscribe((next) => {
    // Disable current
    off();

    // Listen to next
    current = next;
    off = off$();

    for (const [key, lsts] of listeners.entries()) {
      register(key, lsts);
    }
  });

  return {
    on: addListener,
    off: removeListener,
    subscribe: (listener: Listener) => addListener('', listener),
    unsubscribe: (listener: Listener) => removeListener('', listener),
    clear() {
      listeners.clear();
      off();
    }
  };
}
