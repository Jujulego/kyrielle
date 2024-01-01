import {
  SyncReadable,
  Observable,
  AsyncReadable,
  AsyncMutable,
  Readable,
  ObservedValue, Mutable
} from '../defs/index.js';
import { PipeStep } from '../operators/index.js';
import { ref$ } from '../refs/index.js';
import { awaitedCall, dedupedAwaiter } from '../utils/promise.js';

// Types
export interface CacheOrigin<out D = unknown> extends Observable<D>, Readable<D> {}
export interface CacheTarget<in out D> extends Readable<D | undefined>, Mutable<D> {}

export type CacheFn<D> = () => CacheTarget<D>;

/** Builds cached origin */
export type CachedOrigin<O extends CacheOrigin, T extends CacheTarget<ObservedValue<O>>> = (
    T extends AsyncReadable
      ? AsyncReadable<ObservedValue<O>>
      : O extends AsyncReadable
        ? Readable<ObservedValue<O>>
        : T extends AsyncMutable
          ? Readable<ObservedValue<O>>
          : SyncReadable<ObservedValue<O>>
  ) & Observable<ObservedValue<O>>;

/**
 * Uses target as cache for previous origin.
 * "read" calls will be passed to previous only if target contains "undefined".
 *
 * @param target
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ObservedValue<O>>>(target: T): PipeStep<O, CachedOrigin<O, T>>;

/**
 * Uses fn to get cache reference for previous origin.
 * "read" calls will be passed to previous only if selected target contains "undefined".
 *
 * @param fn
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ObservedValue<O>>>(fn: () => T): PipeStep<O, CachedOrigin<O, T>>;

export function cache$<D>(arg: CacheTarget<D> | CacheFn<D>): PipeStep<CacheOrigin<D>, CacheOrigin<D>> {
  return (origin: CacheOrigin<D>, { off }) => {
    const awaiter = dedupedAwaiter();

    const res = ref$<D>((signal) => {
      const target = typeof arg === 'function' ? arg() : arg;

      return awaitedCall<D | undefined, D>(
        (value) => value ?? awaiter.call(() => awaitedCall(target.mutate, origin.read(signal)), signal),
        target.read(signal),
      );
    });

    off.add(origin.subscribe((value) => {
      const target = typeof arg === 'function' ? arg() : arg;

      awaitedCall(res.next, target.mutate(value));
    }));

    return res;
  };
}
