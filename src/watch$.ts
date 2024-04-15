import type {
  Listenable,
  ListenEventMap,
  MappingKey,
  ObservedValue,
  Observer,
  Subscribable,
  Unsubscribable
} from './defs/index.js';

// Type
export type WatchCleanup = () => void;
export type WatchCallback<in D = any> = (data: D) => WatchCleanup | void;  // eslint-disable-line @typescript-eslint/no-explicit-any

export interface WatchObserver<in D = unknown> extends Observer<D> {
  next(data: D): void | WatchCleanup;
  error(error: unknown): void | WatchCleanup;
  complete(): void;
}

/**
 * Register a callback that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<O extends Subscribable>(observable: O, callback: WatchCallback<ObservedValue<O>>): ReturnType<O['subscribe']>;

/**
 * Register an observer that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<O extends Subscribable>(observable: O, observer: Partial<WatchObserver<ObservedValue<O>>>): ReturnType<O['subscribe']>;

/**
 * Register a callback to a given event that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: WatchCallback<ListenEventMap<L>[K]>): ReturnType<L['on']>;

/**
 * Register an observer to a given event that may return a cleanup function.
 * The cleanup function will be called before next call of the callback or when the observable completes.
 */
export function watch$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K, observer: Partial<WatchObserver<ListenEventMap<L>[K]>>): ReturnType<L['on']>;

export function watch$(...args: [Subscribable, WatchCallback | Partial<WatchObserver>] | [Listenable, string, WatchCallback | Partial<WatchObserver>]): Unsubscribable {
  if (typeof args[1] === 'string') {
    const [listener, key, observer] = args as [Listenable, string, WatchCallback | Partial<WatchObserver>];
    return listener.on(key, prepareObserver(observer));
  } else {
    const [observable, observer] = args as [Subscribable, WatchCallback | Partial<WatchObserver>];
    return observable.subscribe(prepareObserver(observer));
  }
}

// Utils
const noop = () => { /* noop */ };

function prepareObserver(arg: WatchCallback | Partial<WatchObserver>): Observer {
  let cleanup: WatchCleanup | void;

  if (typeof arg === 'function') {
    return {
      next(data: unknown) {
        if (cleanup) cleanup();
        cleanup = arg(data);
      },
      error: noop,
      complete() {
        if (cleanup) cleanup();
      }
    };
  } else {
    return {
      start: arg.start?.bind(arg) ?? noop,
      next: arg.next
        ? (data: unknown) => {
          if (cleanup) cleanup();
          cleanup = arg.next!(data);
        }
        : noop,
      error: arg.error
        ? (error: unknown) => {
          if (cleanup) cleanup();
          cleanup = arg.error!(error);
        }
        : noop,
      complete() {
        if (cleanup) cleanup();
        if (arg.complete) arg.complete();
      }
    };
  }
}