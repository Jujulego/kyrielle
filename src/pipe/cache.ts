import { AsyncMutable, AsyncReadable, Awaitable, Mutable, Observable, PipeStep, Readable, ReadValue } from '../defs/index.js';
import { ref$ } from '../refs/index.js';
import { awaitedChain, dedupeAwaiter } from '../utils/promise.js';

// Types
/**
 * Possible cache origins
 */
export interface CacheOrigin<out D = unknown> extends Readable<D>, Partial<Observable<D>> {}

/**
 * Possible cache targets
 */
export interface CacheTarget<in out D> extends Readable<Awaitable<D | undefined>>, Mutable<Awaitable<D>, D> {}

export type CacheFn<D> = () => CacheTarget<D>;

/** Builds cached origin */
export type CachedOrigin<D, O extends CacheOrigin, T extends CacheTarget<D>> =
  & (O extends Observable<D> ? Observable<D> : unknown)
  & (
    T extends AsyncReadable
      ? AsyncReadable<D>
      : O extends AsyncReadable
        ? Readable<Awaitable<D>>
        : T extends AsyncMutable
          ? Readable<Awaitable<D>>
          : Readable<D>
  );

/**
 * Uses target as cache for previous origin.
 * "read" calls will be passed to previous only if target contains "undefined".
 *
 * @param target
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ReadValue<O>>>(target: T): PipeStep<O, CachedOrigin<ReadValue<O>, O, T>>;

/**
 * Uses fn to get cache reference for previous origin.
 * "read" calls will be passed to previous only if selected target contains "undefined".
 *
 * @param fn
 */
export function cache$<O extends CacheOrigin, T extends CacheTarget<ReadValue<O>>>(fn: () => T): PipeStep<O, CachedOrigin<ReadValue<O>, O, T>>;

export function cache$<D>(arg: CacheTarget<D> | CacheFn<D>) {
  return (origin: CacheOrigin<D>) => {
    const awaiter = dedupeAwaiter<Awaitable<D>>();

    const res = ref$({
      read(signal) {
        const target = typeof arg === 'function' ? arg() : arg;

        return awaitedChain(target.read(signal), (value) => value ?? awaiter.call(() => awaitedChain(origin.read(signal), (result) => target.mutate(result, signal)), signal));
      }
    });

    if ('subscribe' in origin) {
      origin.subscribe((value) => {
        const target = typeof arg === 'function' ? arg() : arg;
        awaitedChain(target.mutate(value), res.next);
      });
    }

    return res;
  };
}
