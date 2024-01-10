import {
  AsAwaitableAs,
  Awaitable,
  Mutable,
  Observable,
  PipeStep,
  Readable,
  ReadValue
} from '../defs/index.js';
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
export type CachedOrigin<D, O extends CacheOrigin, TRD extends Awaitable<D | undefined>, TMD extends Awaitable<D>> =
  & (O extends Observable<D> ? Observable<D> : unknown)
  & (
    TRD extends PromiseLike<D | undefined>
      ? Readable<PromiseLike<D>>
      : O extends Readable<infer ORD>
        ? Readable<AsAwaitableAs<ORD, D> | AsAwaitableAs<TRD, D> | AsAwaitableAs<TMD, D>>
        : never
  );

/**
 * Uses target as cache for previous origin.
 * "read" calls will be passed to previous only if target contains "undefined".
 *
 * @param target
 */
export function cache$<O extends CacheOrigin, TRD extends Awaitable<ReadValue<O> | undefined>, TMD extends Awaitable<ReadValue<O>>>(target: Readable<TRD> & Mutable<TMD, ReadValue<O>>): PipeStep<O, CachedOrigin<ReadValue<O>, O, TRD, TMD>>;

/**
 * Uses fn to get cache reference for previous origin.
 * "read" calls will be passed to previous only if selected target contains "undefined".
 *
 * @param fn
 */
export function cache$<O extends CacheOrigin, TRD extends Awaitable<ReadValue<O> | undefined>, TMD extends Awaitable<ReadValue<O>>>(fn: () => Readable<TRD> & Mutable<TMD, ReadValue<O>>): PipeStep<O, CachedOrigin<ReadValue<O>, O, TRD, TMD>>;

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
