import {
  AsyncMutable,
  AsyncReadable, Awaitable, CopyMutableSynchronicity, CopyReadableSynchronicity,
  Mutable,
  Observable,
  PipedValue, PipeOrigin, PipeStep,
  Readable,
} from '../defs/index.js';
import { awaitedCall } from '../utils/promise.js';
import { source$ } from '../events/source.js';

// Types
export type EachFn<DA, DB> = (arg: DA, signal?: AbortSignal) => Awaitable<DB>;
export type SyncEachFn<DA, DB> = (arg: DA) => DB;
export type AsyncEachFn<DA, DB> = (arg: DA, signal?: AbortSignal) => PromiseLike<DB>;

/** Builds an async source type, with same features than A, but a different data type DB */
export type EachAsyncSource<A extends PipeOrigin, DB> =
  & (A extends Observable ? Observable<DB> : unknown)
  & (A extends Readable ? AsyncReadable<DB> : unknown)
  & (A extends Mutable<unknown, infer AA> ? AsyncMutable<DB, AA> : unknown);

/** Builds a source type, with same features and synchronicity than A, but a different data type DB */
export type EachSyncSource<A extends PipeOrigin, DB> =
  & (A extends Observable ? Observable<DB> : unknown)
  & (A extends Readable ? CopyReadableSynchronicity<A, DB> : unknown)
  & (A extends Mutable<unknown, infer AA> ? CopyMutableSynchronicity<A, DB, AA> : unknown);

/** Builds an awaitable source type, with same features than A, but a different data type DB */
export type EachSource<A extends PipeOrigin, DB> =
  & (A extends Observable ? Observable<DB> : unknown)
  & (A extends Readable ? Readable<DB> : unknown)
  & (A extends Mutable<unknown, infer AA> ? Mutable<DB, AA> : unknown);

// Operator
/**
 * Applies fn to each emitted value, read result and mutate result.
 * As fn is asynchronous, read and mutate in the final reference will too be asynchronous.
 *
 * WARNING: Order is not guaranteed, results will be emitted as they are resolved not as input comes.
 *
 * @param fn
 */
export function each$<A extends PipeOrigin, DB>(fn: AsyncEachFn<PipedValue<A>, DB>): PipeStep<A, EachAsyncSource<A, DB>>;

/**
 * Applies fn to each emitted value, read result and mutate result.
 * As fn is synchronous, read and mutate in the final reference will have the same synchronicity as the base ref.
 *
 * @param fn
 */
export function each$<A extends PipeOrigin, DB>(fn: SyncEachFn<PipedValue<A>, DB>): PipeStep<A, EachSyncSource<A, DB>>;

/**
 * Applies fn to each emitted value, read result and mutate result.
 *
 * @param fn
 */
export function each$<A extends PipeOrigin, DB>(fn: EachFn<PipedValue<A>, DB>): PipeStep<A, EachSource<A, DB>>;

export function each$<DA, AA, DB>(fn: EachFn<DA, DB>): PipeStep<PipeOrigin<DA>, PipeOrigin<DB>> {
  return (obs: PipeOrigin<DA>) => {
    const out = source$<DB>();

    if ('read' in obs) {
      Object.assign(out, {
        read: (signal?: AbortSignal) => awaitedCall<DA, DB>((arg) => fn(arg, signal), (obs as Readable<DA>).read(signal)),
      });
    }

    if ('mutate' in obs) {
      Object.assign(out, {
        mutate: (arg: AA) => awaitedCall(fn, awaitedCall((obs as Mutable<DA, AA>).mutate, arg))
      });
    }

    if ('subscribe' in obs) {
      obs.subscribe((data) => awaitedCall(out.next, fn(data)));
    }

    return out;
  };
}
