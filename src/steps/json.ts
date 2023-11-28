import {
  CopyMutableSynchronicity,
  CopyReadableSynchronicity,
  Mutable,
  Readable, Source
} from '../defs/index.js';
import { PipeStep } from '../operators/index.js';
import { source$ } from '../source.js';
import { awaitedCall } from '../utils/promise.js';

// Types
export type JsonOrigin = Source<string>
  & Partial<Readable<string>>
  & Partial<Mutable<string, string>>;

export type JsonResultOrigin<A extends JsonOrigin, D> = Source<D>
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

  return (obs: A, { off }) => {
    const out = source$<DB | null>();

    if ('read' in obs) {
      Object.assign(out, {
        read: () => awaitedCall(parse, (obs as Readable<string>).read())
      });
    }

    if ('mutate' in obs) {
      Object.assign(out, {
        mutate: (arg: DB) => awaitedCall(parse, awaitedCall((obs as Mutable<string, string>).mutate, JSON.stringify(arg))),
      });
    }

    off.add(
      obs.subscribe((json) => out.next(parse(json)))
    );

    return out as unknown as JsonResultOrigin<A, DB | null>;
  };
}
