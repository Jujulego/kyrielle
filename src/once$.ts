import type {
  Listenable,
  ListenEventMap,
  MappingKey,
  ObservedValue,
  Observer, PartialObserver,
  Subscribable,
  Unsubscribable
} from './defs/index.js';
import { observer$ } from './observer$.js';

// Type
export type OnceCallback<in D = any> = (data: D) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Register a callback that will be called only once
 */
export function once$<O extends Subscribable>(observable: O, callback: OnceCallback<ObservedValue<O>>): ReturnType<O['subscribe']>;

/**
 * Register an observer that completes right after the first call (either "next" or "error")
 */
export function once$<O extends Subscribable>(observable: O, observer: PartialObserver<ObservedValue<O>>): ReturnType<O['subscribe']>;

/**
 Register a callback that will be called only once
 */
export function once$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, callback: OnceCallback<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/**
 * Register an observer to a given event, that completes right after the first call (either "next" or "error")
 */
export function once$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: PartialObserver<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/** @internal */
export function once$(...args: [Subscribable, OnceCallback | PartialObserver] | [Listenable, string, OnceCallback | PartialObserver]): Unsubscribable;

export function once$(...args: [Subscribable, OnceCallback | PartialObserver] | [Listenable, string, OnceCallback | PartialObserver]): Unsubscribable {
  let sub: Unsubscribable;

  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [Listenable, string, OnceCallback | PartialObserver];
    sub = listener.on(key, prepareObserver(observer, () => sub.unsubscribe()));
  } else {
    const [observable, observer] = args as [Subscribable, OnceCallback | PartialObserver];
    sub = observable.subscribe(prepareObserver(observer, () => sub.unsubscribe()));
  }

  return sub;
}

// Utils
function prepareObserver(arg: OnceCallback | PartialObserver, unsub: () => void): Observer {
  if (typeof arg === 'function') {
    return observer$({
      next(data: unknown) {
        unsub();
        arg(data);
      }
    });
  } else {
    return observer$({
      start: arg.start?.bind(arg),
      next: arg.next && ((data: unknown) => {
        unsub();
        arg.next!(data);
      }),
      error: arg.error && ((error: unknown) => {
        unsub();
        arg.error!(error);
      }),
      complete: arg.complete?.bind(arg),
    });
  }
}