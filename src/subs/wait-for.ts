import { DataKey, DataMap, Key, Listenable, Listener, Observable } from '../defs/index.js';
import { OffGroup, off$ } from './off.js';
import { once$, OnceArgs, OnceOpts } from './once.js';

// Types
/** @internal */
export type WaitForObservableArgs = [obs: Observable, opts?: OnceOpts | undefined];

/** @internal */
export type WaitForListenableArgs = [source: Listenable, key: Key, opts?: OnceOpts | undefined];

/** @internal */
export type WaitForArgs = WaitForObservableArgs | WaitForListenableArgs;

/**
 * Returns a promise that resolves when the given observable emits
 * @param obs
 * @param opts
 */
export function waitFor$<D>(obs: Observable<D>, opts?: OnceOpts): Promise<D>;

/**
 * Returns a promise that resolves when the given source emits the "key" event
 * @param source
 * @param key
 * @param opts
 */
export function waitFor$<M extends DataMap, K extends DataKey<M>>(source: Listenable<M>, key: K, opts?: OnceOpts): Promise<M[K]>;

/** @internal */
export function waitFor$(...args: WaitForArgs): Promise<unknown>;

export function waitFor$(...args: WaitForArgs): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const parsed = parseArgs(args, resolve);
    const off = parsed.off ?? off$();

    off.add(once$(...parsed.args));
    off.add(() => reject(new Error('Unsubscribed !')));
  });
}

// Utils
function parseArgs(args: WaitForArgs, resolve: Listener): { args: OnceArgs; off: OffGroup | undefined } {
  if (typeof args[1] === 'string') {
    const [lst, key, opts] = args as WaitForListenableArgs;
    return { args: [lst, key, resolve], off: opts?.off };
  } else {
    const [obs, opts] = args as WaitForObservableArgs;
    return { args: [obs, resolve], off: opts?.off };
  }
}
