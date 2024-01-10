import { AsAwaitableAs, Mutable, Observable, PipedValue, PipeOrigin, PipeStep, Readable } from '../defs/index.js';
import { source$ } from '../events/source.js';
import { isMutable, isReadable } from '../utils/predicate.js';
import { awaitedChain } from '../utils/promise.js';

// Types
export type EachFn<A, R> = (arg: A, signal?: AbortSignal) => R;

/** Builds an awaitable source type, with same features than A, but a different data type DB */
export type EachSource<O extends PipeOrigin, R> =
  & (O extends Observable ? Observable<Awaited<R>> : unknown)
  & (O extends Readable<infer RD> ? Readable<AsAwaitableAs<RD, R>> : unknown)
  & (O extends Mutable<infer MD, infer MA> ? Mutable<AsAwaitableAs<MD, R>, MA> : unknown);

/**
 * Applies fn to each emitted value, read result and mutate result.
 *
 * WARNING: In async context, order is not guaranteed, results will be emitted as they are resolved not as input comes.
 *
 * @param fn
 */
export function each$<O extends PipeOrigin, R>(fn: EachFn<PipedValue<O>, R>): PipeStep<O, EachSource<O, R>>;

export function each$<D, R>(fn: EachFn<D, R>) {
  return (obs: PipeOrigin<D>) => {
    const out = source$<R>();

    if (isReadable<D>(obs)) {
      Object.assign(out, {
        read: (signal?: AbortSignal) => awaitedChain(obs.read(signal), (arg: D) => fn(arg, signal)),
      });
    }

    if (isMutable<Mutable<D>>(obs)) {
      Object.assign(out, {
        mutate: (arg: unknown, signal?: AbortSignal) => awaitedChain(obs.mutate(arg, signal), (arg: D) => fn(arg, signal))
      });
    }

    if ('subscribe' in obs) {
      obs.subscribe((data) => awaitedChain(fn(data), out.next));
    }

    return out;
  };
}
