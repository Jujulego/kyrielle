import { DataKey, DataMap, Listenable, Listener, Observable, OffFn } from '../defs/index.js';

// Types
export type WatchCleanUp = () => void;
export type WatchFn<D = unknown> = (data: D) => WatchCleanUp | undefined;

/** @internal */
export type WatchObservableArgs = [obs: Observable, listener: WatchFn];

/** @internal */
export type WatchListenableArgs = [source: Listenable, key: string, listener: WatchFn];

/** @internal */
export type WatchArgs = WatchObservableArgs | WatchListenableArgs;

/**
 * Register a listener, that may return a "cleanup" function
 * @param origin
 * @param fn
 */
export function watch$<D>(origin: Observable<D>, fn: WatchFn<D>): OffFn;

/**
 * Register a listener to key event, that may return a "cleanup" function
 * @param source
 * @param key
 * @param fn
 */
export function watch$<const M extends DataMap, const K extends DataKey<M>>(source: Listenable<M>, key: K, fn: WatchFn<M[K]>): OffFn;

export function watch$(...args: WatchArgs): OffFn {
  let cleanUp: WatchCleanUp | undefined;

  function wrapFn(fn: WatchFn): Listener {
    return (data: unknown) => {
      if (cleanUp) {
        cleanUp();
      }

      cleanUp = fn(data);
    };
  }

  if (typeof args[1] === 'function') {
    const [obs, fn] = args as WatchObservableArgs;

    return obs.subscribe(wrapFn(fn));
  } else {
    const [lst, key, fn] = args as WatchListenableArgs;

    return lst.on(key, wrapFn(fn));
  }
}
