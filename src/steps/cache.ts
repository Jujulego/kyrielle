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
import { awaitedCall, cachedAwaiter } from '../utils/promise.js';

// Types
export interface CacheOrigin<out D = unknown> extends Observable<D>, Readable<D> {}
export interface CacheTarget<in out D> extends Readable<D | undefined>, Mutable<D> {}

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

export function cache$<O extends CacheOrigin, T extends CacheTarget<ObservedValue<O>>>(target: T): PipeStep<O, CachedOrigin<O, T>>;

export function cache$<D>(target: CacheTarget<D>): PipeStep<CacheOrigin<D>, CacheOrigin<D>> {
  return (origin: CacheOrigin<D>, { off }) => {
    const awaiter = cachedAwaiter();

    const res = ref$<D>(() => {
      return awaitedCall<D | undefined, D>(
        (value) => value !== undefined ? value : awaiter.call(() => awaitedCall(target.mutate, origin.read())),
        target.read(),
      );
    });

    off.add(origin.subscribe((value) => {
      awaitedCall(res.next, target.mutate(value));
    }));

    return res;
  };
}
