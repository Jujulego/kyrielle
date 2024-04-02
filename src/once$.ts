import type {
  Listenable,
  ListenEventMap,
  MappingKey,
  ObservedValue,
  Observer,
  Subscribable,
  Unsubscribable
} from './defs/index.js';

/**
 * Register an observer that completes right after the first call (either "next" or "error")
 */
export function once$<O extends Subscribable>(observable: O, observer: Partial<Observer<ObservedValue<O>>>): ReturnType<O['subscribe']>;

/**
 * Register an observer to a given event, that completes right after the first call (either "next" or "error")
 */
export function once$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: Partial<Observer<ListenEventMap<L>[K]>>): ReturnType<L['on']>;

/** @internal */
export function once$(...args: [Subscribable, Partial<Observer>] | [Listenable, string, Partial<Observer>]): Unsubscribable;

export function once$(...args: [Subscribable, Partial<Observer>] | [Listenable, string, Partial<Observer>]): Unsubscribable {
  let sub: Unsubscribable;

  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [Listenable, string, Partial<Observer>];
    sub = listener.on(key, prepareObserver(observer, () => sub.unsubscribe()));
  } else {
    const [observable, observer] = args as [Subscribable, Partial<Observer>];
    sub = observable.subscribe(prepareObserver(observer, () => sub.unsubscribe()));
  }

  return sub;
}

function prepareObserver(base: Partial<Observer>, unsub: () => void): Partial<Observer> {
  const result: Partial<Observer> = {};

  for (const cb of ['next', 'error', 'complete'] as const) {
    if (cb in base) {
      Object.assign(result, {
        [cb]: (...args: [arg?: unknown]) => {
          unsub();
          base[cb]!(...args);
        }
      });
    }
  }

  return result;
}