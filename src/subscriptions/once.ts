import { OffGroup } from './off.js';
import { DataKey, DataMap, Listenable, Listener, Observable, OffFn } from '../defs/index.js';

// Types
export interface OnceOpts {
  off?: OffGroup;
}

/** @internal */
export type OnceObservableArgs = [obs: Observable, listener: Listener, opts?: OnceOpts | undefined];

/** @internal */
export type OnceListenableArgs = [source: Listenable, key: string, listener: Listener, opts?: OnceOpts | undefined];

/** @internal */
export type OnceArgs = OnceObservableArgs | OnceListenableArgs;

/**
 * Register a listener that will only be called once.
 * @param obs
 * @param listener
 * @param opts
 */
export function once$<D>(obs: Observable<D>, listener: Listener<D>, opts?: OnceOpts): OffFn;

/**
 * Register a listener to key event that will only be called once.
 * @param source
 * @param key
 * @param listener
 * @param opts
 */
export function once$<const M extends DataMap, const K extends DataKey<M>>(source: Listenable<M>, key: K, listener: Listener<M[K]>, opts?: OnceOpts): OffFn;

/** @internal */
export function once$(...args: OnceArgs): OffFn;

export function once$(...args: OnceArgs): OffFn {
  let off: OffFn;

  if (typeof args[1] === 'function') {
    const [obs, listener, opts = {}] = args as OnceObservableArgs;

    off = keepOrJoin(opts.off, obs.subscribe((data) => {
      off();
      listener(data);
    }));
  } else {
    const [lst, key, listener, opts = {}] = args as OnceListenableArgs;

    off = keepOrJoin(opts.off, lst.on(key, (data) => {
      off();
      listener(data);
    }));
  }

  return off;
}

// Utils
function keepOrJoin(group: OffGroup | undefined, off: OffFn): OffFn {
  if (group) {
    group.add(off);
    return group;
  } else {
    return off;
  }
}
