import { Draft, Immer, produce } from 'immer';

import { AsyncMutable, AsyncReadable, Awaitable, Mutable, Readable } from '../defs/index.js';
import { awaitedCall } from '../utils/index.js';

// Types
export type RecipeFn<D> = (draft: Draft<D>) => Draft<D> | void;

export interface ProduceOrigin<D> extends Readable<Awaitable<D>>, Mutable<Awaitable<D>, D> {}

export type ProduceResult<D, R extends ProduceOrigin<D>> =
  R extends AsyncReadable
    ? PromiseLike<D>
    : R extends AsyncMutable
      ? PromiseLike<D>
      : D;

export interface ProduceOpts {
  /**
   * Custom instance of Immer to use. By default, it will use the global instance.
   */
  immer?: Immer;

  /**
   * Signal to give to read call
   */
  signal?: AbortSignal;
}

/**
 * Use an Immer recipe to mutate reference
 * @param ref
 * @param recipe
 * @param opts
 */
export function produce$<D, R extends ProduceOrigin<D>>(ref: R, recipe: RecipeFn<D>, opts: ProduceOpts = {}): ProduceResult<D, R> {
  return awaitedCall(
    awaitedCall(ref.read(opts.signal), (old) => (opts.immer?.produce ?? produce)(old, recipe)),
    (result) => ref.mutate(result, opts.signal)
  ) as ProduceResult<D, R>;
}
