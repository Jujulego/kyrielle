import { Draft, Immer, produce } from 'immer';

import { AsyncMutable, AsyncReadable, Mutable, Readable, ReadValue } from '../defs/index.js';
import { awaitedChain } from '../utils/index.js';

// Types
export type RecipeFn<in out D> = (draft: Draft<D>) => Draft<D> | void;

export interface ProduceOrigin<in out D = unknown> extends Readable<D>, Mutable<D, Awaited<D>> {}

export type ProduceResult<R extends ProduceOrigin> =
  R extends AsyncReadable
    ? PromiseLike<Awaited<ReadValue<R>>>
    : R extends AsyncMutable
      ? PromiseLike<Awaited<ReadValue<R>>>
      : ReadValue<R>;

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
export function produce$<R extends ProduceOrigin>(ref: R, recipe: RecipeFn<Awaited<ReadValue<R>>>, opts: ProduceOpts = {}): ProduceResult<R> {
  return awaitedChain(
    awaitedChain(ref.read(opts.signal), (old) => (opts.immer?.produce ?? produce)(old, recipe)),
    (result) => ref.mutate(result, opts.signal)
  ) as ProduceResult<R>;
}
