import {
  AsyncMutable,
  AsyncReadable,
  Mutable,
  Observable,
  PipeStep,
  Readable,
  ReadValue,
  SyncReadable
} from '../defs/index.js';
import { ref$ } from '../refs/index.js';
import { awaitedCall, dedupedAwaiter } from '../utils/promise.js';

// Types
export interface CacheOrigin<out D = unknown> extends Readable<D>, Partial<Observable<D>> {}
export interface CacheTarget<in out D> extends Readable<D | undefined>, Mutable<D> {}

export type CacheFn<D> = () => CacheTarget<D>;

/** Builds cached origin */
export type CachedOrigin<O extends CacheOrigin, T extends CacheTarget<ReadValue<O>>> =
  & (O extends Observable ? Observable<ReadValue<O>> : unknown)
  & (
    T extends AsyncReadable
      ? AsyncReadable<ReadValue<O>>
      : O extends AsyncReadable
        ? Readable<ReadValue<O>>
        : T extends AsyncMutable
          ? Readable<ReadValue<O>>
          : SyncReadable<ReadValue<O>>
  );

/**
 * Uses target as cache for previous origin.
 * "read" calls will be passed to previous only if target contains "undefined".
 *
 * @param target
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ReadValue<O>>>(target: T): PipeStep<O, CachedOrigin<O, T>>;

/**
 * Uses fn to get cache reference for previous origin.
 * "read" calls will be passed to previous only if selected target contains "undefined".
 *
 * @param fn
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ReadValue<O>>>(fn: () => T): PipeStep<O, CachedOrigin<O, T>>;

export function cache$<D>(arg: CacheTarget<D> | CacheFn<D>): PipeStep<CacheOrigin<D>, CacheOrigin<D>> {
  return (origin: CacheOrigin<D>) => {
    const awaiter = dedupedAwaiter();

    const res = ref$<D>((signal) => {
      const target = typeof arg === 'function' ? arg() : arg;

      return awaitedCall<D | undefined, D>(
        (value) => value ?? awaiter.call(() => awaitedCall(target.mutate, origin.read(signal)), signal),
        target.read(signal),
      );
    });

    if ('subscribe' in origin) {
      origin.subscribe((value) => {
        const target = typeof arg === 'function' ? arg() : arg;
        awaitedCall(res.next, target.mutate(value));
      });
    }

    return res;
  };
}
