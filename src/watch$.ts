import { observer$ } from './observer$.js';
import type { PartialObserver } from './types/inputs/Observer.js';
import type { Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { MappingKey } from './types/mapping.js';
import type { ListenEventMap, StrictListenable } from './types/outputs/StrictListenable.js';
import type { StrictObserver } from './types/outputs/StrictObserver.js';
import type { Subscription } from './types/outputs/Subscription.js';
import { wrapUnsubscribable } from './utils/subscription.js';

// Type
export type WatchCleanup = () => void;
export type WatchCallback<in D = any> = (data: D) => WatchCleanup | void; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface WatchObserver<in D = unknown> extends PartialObserver<D> {
  next?: ((data: D) => void | WatchCleanup) | undefined;
  error?: ((error: unknown) => void | WatchCleanup) | undefined;
}

/**
 * Register a callback that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<O extends Subscribable>(observable: O, callback: WatchCallback<SubscribableValue<O>>): ReturnType<O['subscribe']>;

/**
 * Register an observer that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<O extends Subscribable>(observable: O, observer: Partial<WatchObserver<SubscribableValue<O>>>): ReturnType<O['subscribe']>;

/**
 * Register a callback to a given event that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: WatchCallback<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/**
 * Register an observer to a given event that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: Partial<WatchObserver<ListenEventMap<L>[K]>>): ReturnType<L['on']>;

export function watch$(...args: [Subscribable, WatchCallback | Partial<WatchObserver>] | [StrictListenable, string, WatchCallback | Partial<WatchObserver>]): Subscription {
  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [StrictListenable, string, WatchCallback | Partial<WatchObserver>];
    return listener.on(key, prepareObserver(observer));
  } else {
    const [observable, observer] = args as [Subscribable, WatchCallback | Partial<WatchObserver>];
    return wrapUnsubscribable(observable.subscribe(prepareObserver(observer)));
  }
}

// Utils
function prepareObserver(arg: WatchCallback | Partial<WatchObserver>): StrictObserver {
  let cleanup: WatchCleanup | void;

  if (typeof arg === 'function') {
    return observer$({
      next: (data: unknown) => {
        if (cleanup) cleanup();
        cleanup = arg(data);
      },
      complete: () => {
        if (cleanup) cleanup();
      }
    });
  } else {
    return observer$({
      start: arg.start?.bind(arg),
      next: arg.next && ((data: unknown) => {
        if (cleanup) cleanup();
        cleanup = arg.next!(data);
      }),
      error: arg.error && ((error: unknown) => {
        if (cleanup) cleanup();
        cleanup = arg.error!(error);
      }),
      complete: () => {
        if (cleanup) cleanup();
        if (arg.complete) arg.complete();
      }
    });
  }
}