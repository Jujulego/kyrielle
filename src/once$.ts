import { observer$ } from './observer$.js';
import type { PartialObserver } from './types/inputs/Observer.js';
import type { Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { MappingKey } from './types/mapping.js';
import type { ListenEventMap, StrictListenable } from './types/outputs/StrictListenable.js';
import type { StrictObserver } from './types/outputs/StrictObserver.js';
import type { Subscription } from './types/outputs/Subscription.js';
import { wrapUnsubscribable } from './utils/subscription.js';

// Type
export type OnceCallback<in D = any> = (data: D) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Register a callback that will be called only once
 *
 * @since 1.0.0
 */
export function once$<O extends Subscribable>(observable: O, callback: OnceCallback<SubscribableValue<O>>): ReturnType<O['subscribe']>;

/**
 * Register an observer that completes right after the first call (either "next" or "error")
 *
 * @since 1.0.0
 */
export function once$<O extends Subscribable>(observable: O, observer: PartialObserver<SubscribableValue<O>>): ReturnType<O['subscribe']>;

/**
 Register a callback that will be called only once

 @since 1.0.0
 */
export function once$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, callback: OnceCallback<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/**
 * Register an observer to a given event, that completes right after the first call (either "next" or "error")
 *
 * @since 1.0.0
 */
export function once$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: PartialObserver<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/** @internal */
export function once$(...args: [Subscribable, OnceCallback | PartialObserver] | [StrictListenable, string, OnceCallback | PartialObserver]): Subscription;

export function once$(...args: [Subscribable, OnceCallback | PartialObserver] | [StrictListenable, string, OnceCallback | PartialObserver]): Subscription {
  let sub: Subscription;

  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [StrictListenable, string, OnceCallback | PartialObserver];
    sub = listener.on(key, prepareObserver(observer, () => sub.unsubscribe()));
  } else {
    const [observable, observer] = args as [Subscribable, OnceCallback | PartialObserver];
    sub = wrapUnsubscribable(observable.subscribe(prepareObserver(observer, () => sub.unsubscribe())));
  }

  return sub;
}

// Utils
function prepareObserver(arg: OnceCallback | PartialObserver, unsub: () => void): StrictObserver {
  if (typeof arg === 'function') {
    return observer$({
      next: (data: unknown) => {
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