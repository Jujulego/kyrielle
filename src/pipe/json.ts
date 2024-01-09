import {
  AsAwaitableAs,
  Awaitable,
  Mutable, Observable, PipeOrigin, PipeStep,
  Readable
} from '../defs/index.js';
import { source$ } from '../events/source.js';
import { isMutable, isReadable } from '../utils/predicate.js';
import { awaitedChain } from '../utils/promise.js';

// Types
export type JsonOrigin = PipeOrigin<Awaitable<string>>;

export type JsonResultOrigin<O extends JsonOrigin, D> =
  & (O extends Observable<string> ? Observable<D> : unknown)
  & (O extends Readable<infer RD> ? Readable<AsAwaitableAs<RD, D>> : unknown)
  & (O extends Mutable<infer MD, string> ? Mutable<AsAwaitableAs<MD, D>, D> : unknown)

/**
 * Convert value from base origin
 */
export function json$<O extends JsonOrigin, D>(validate: (val: unknown) => val is D): PipeStep<O, JsonResultOrigin<O, D | null>> {
  function parse(json: string): D | null {
    const val = JSON.parse(json);
    return validate(val) ? val : null;
  }

  return (origin: O) => {
    const out = source$<D | null>();

    if (isReadable<string>(origin)) {
      Object.assign(out, {
        read: (signal?: AbortSignal) => awaitedChain(origin.read(signal), parse)
      });
    }

    if (isMutable<Mutable<string, string>>(origin)) {
      Object.assign(out, {
        mutate: (arg: D, signal?: AbortSignal) => awaitedChain(origin.mutate(JSON.stringify(arg), signal), parse),
      });
    }

    if ('subscribe' in origin) {
      origin.subscribe((json) => out.next(parse(json)));
    }

    return out as JsonResultOrigin<O, D | null>;
  };
}
