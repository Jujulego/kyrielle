import {
  AsyncMutableRef, AsyncRef, Awaitable, CopyMutableRefSynchronicity,
  CopyRefSynchronicity,
  Mutable,
  MutableRef,
  Observable as Obs, ObservedValue,
  Readable,
  Ref, Source
} from '../defs/index.js';
import { awaitedCall } from '../utils/promise.js';
import { PipeStep } from '../operators/index.js';
import { source$ } from '../source.js';

// Types
export type EachFn<DA, DB> = (arg: DA, signal?: AbortSignal) => Awaitable<DB>;
export type SyncEachFn<DA, DB> = (arg: DA) => DB;
export type AsyncEachFn<DA, DB> = (arg: DA, signal?: AbortSignal) => PromiseLike<DB>;

/** Builds an async source type, with same features than A, but a different data type DB */
export type EachAsyncSource<A extends Obs, DB> = A extends Ref
  ? A extends Mutable<unknown, infer AA>
    ? AsyncMutableRef<DB, AA>
    : AsyncRef<DB>
  : Source<DB>;

/** Builds a source type, with same features and synchronicity than A, but a different data type DB */
export type EachSyncSource<A extends Obs, DB> = A extends Ref
  ? A extends Mutable<unknown, infer AA>
    ? CopyMutableRefSynchronicity<A, DB, AA>
    : CopyRefSynchronicity<A, DB>
  : Source<DB>;

/** Builds an awaitable source type, with same features than A, but a different data type DB */
export type EachSource<A extends Obs, DB> = A extends Ref
  ? A extends Mutable<unknown, infer AA>
    ? MutableRef<DB, AA>
    : Ref<DB>
  : Source<DB>;

// Operator
/**
 * Applies fn to each emitted value, read result and mutate result.
 * As fn is asynchronous, read and mutate in the final reference will too be asynchronous.
 *
 * WARNING: Order is not guaranteed, results will be emitted as they are resolved not as input comes.
 *
 * @param fn
 */
export function each$<A extends Obs, DB>(fn: AsyncEachFn<ObservedValue<A>, DB>): PipeStep<A, EachAsyncSource<A, DB>>;

/**
 * Applies fn to each emitted value, read result and mutate result.
 * As fn is synchronous, read and mutate in the final reference will have the same synchronicity as the base ref.
 *
 * @param fn
 */
export function each$<A extends Obs, DB>(fn: SyncEachFn<ObservedValue<A>, DB>): PipeStep<A, EachSyncSource<A, DB>>;

/**
 * Applies fn to each emitted value, read result and mutate result.
 *
 * @param fn
 */
export function each$<A extends Obs, DB>(fn: EachFn<ObservedValue<A>, DB>): PipeStep<A, EachSource<A, DB>>;

export function each$<DA, AA, DB>(fn: EachFn<DA, DB>): PipeStep<Obs<DA>, Obs<DB>> {
  return (obs: Obs<DA>, { off }) => {
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

    off.add(
      obs.subscribe((data) => awaitedCall(out.next, fn(data)))
    );

    return out;
  };
}
