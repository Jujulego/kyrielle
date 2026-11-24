import { observer$ } from './rx/observer$.js';
import type {
  MinimalObserver,
  ObserverNextCallback,
  PartialObserver,
} from './features/minimal-observer.js';
import type { Subscribable, SubscribableValue } from './features/subscribable.js';
import type { MappingKey } from './types/mapping.js';
import type { ListenEventMap, StrictListenable } from './types/outputs/StrictListenable.js';
import type { Observer } from './rx/types/observer.js';
import type { Subscription } from './rx/types/subscription.js';
import { wrapUnsubscribable } from './utils/subscription.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnceCallback<D = any> = ObserverNextCallback<D>;

/**
 * Register a callback that will be called only once
 *
 * @since 1.0.0
 */
export function once$<O extends Subscribable>(
  observable: O,
  callback: OnceCallback<SubscribableValue<O>>,
): ReturnType<O['subscribe']>;

/**
 * Register an observer that completes right after the first call (either "next" or "error")
 *
 * @since 1.0.0
 */
export function once$<O extends Subscribable>(
  observable: O,
  observer: PartialObserver<SubscribableValue<O>>,
): ReturnType<O['subscribe']>;

/**
 Register a callback that will be called only once

 @since 1.0.0
 */
export function once$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(
  listenable: L,
  key: K,
  callback: OnceCallback<ListenEventMap<L>[K]>,
): ReturnType<L['on']>;

/**
 * Register an observer to a given event, that completes right after the first call (either "next" or "error")
 *
 * @since 1.0.0
 */
export function once$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(
  listenable: L,
  key: K,
  observer: MinimalObserver<ListenEventMap<L>[K]>,
): ReturnType<L['on']>;

/** @internal */
export function once$(
  ...args:
    | [Subscribable, OnceCallback | PartialObserver]
    | [StrictListenable, string, OnceCallback | PartialObserver]
): Subscription;

export function once$(
  ...args:
    | [Subscribable, OnceCallback | PartialObserver]
    | [StrictListenable, string, OnceCallback | PartialObserver]
): Subscription {
  let sub: Subscription;

  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [
      StrictListenable,
      string,
      OnceCallback | PartialObserver,
    ];
    sub = listener.on(
      key,
      prepareObserver(observer, () => sub.unsubscribe()),
    );
  } else {
    const [observable, observer] = args as [Subscribable, OnceCallback | PartialObserver];
    sub = wrapUnsubscribable(
      observable.subscribe(prepareObserver(observer, () => sub.unsubscribe())),
    );
  }

  return sub;
}

// Utils
function prepareObserver(arg: OnceCallback | MinimalObserver, unsub: () => void): Observer {
  let called = false;

  function wrap(cb: (arg: unknown) => void) {
    return (data: unknown) => {
      if (!called) {
        called = true;

        cb(data);
        queueMicrotask(unsub);
      }
    };
  }

  if (typeof arg === 'function') {
    return observer$({
      next: wrap(arg),
    });
  } else {
    return observer$({
      start: arg.start?.bind(arg),
      next: wrap(arg.next.bind(arg)),
      error: arg.error && wrap(arg.error.bind(arg)),
      complete: arg.complete?.bind(arg),
    });
  }
}
