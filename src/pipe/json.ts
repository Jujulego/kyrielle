import {
  CopyMutableSynchronicity,
  CopyReadableSynchronicity,
  Mutable, Observable, PipeOrigin, PipeStep,
  Readable
} from '../defs/index.js';
import { source$ } from '../events/source.js';
import { awaitedCall } from '../utils/promise.js';

// Types
export type JsonOrigin = PipeOrigin<string>;

export type JsonResultOrigin<A extends JsonOrigin, D> =
  & (A extends Observable<string> ? Observable<D> : unknown)
  & (A extends Readable<string> ? CopyReadableSynchronicity<A, D> : unknown)
  & (A extends Mutable<string, string> ? CopyMutableSynchronicity<A, D, D> : unknown)

/**
 * Convert value from base origin
 */
export function json$<A extends JsonOrigin, DB>(validate: (val: unknown) => val is DB): PipeStep<A, JsonResultOrigin<A, DB | null>> {
  function parse(json: string): DB | null {
    const val = JSON.parse(json);
    return validate(val) ? val : null;
  }

  return (origin: A) => {
    const out = source$<DB | null>();

    if ('read' in origin) {
      Object.assign(out, {
        read: (signal?: AbortSignal) => awaitedCall(parse, (origin as Readable<string>).read(signal))
      });
    }

    if ('mutate' in origin) {
      Object.assign(out, {
        mutate: (arg: DB) => awaitedCall(parse, awaitedCall((origin as Mutable<string, string>).mutate, JSON.stringify(arg))),
      });
    }

    if ('subscribe' in origin) {
      origin.subscribe((json) => out.next(parse(json)));
    }

    return out as JsonResultOrigin<A, DB | null>;
  };
}
