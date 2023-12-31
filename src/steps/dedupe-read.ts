import { Observable, Readable } from '../defs/index.js';
import { PipeStep } from '../operators/index.js';
import { dedupedAwaiter } from '../utils/index.js';
import { ref$ } from '../refs/index.js';

// Types
export interface DedupeReadOrigin<out D = unknown> extends Observable<D>, Readable<D> {}

/**
 * Deduplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 */
export function dedupeRead$<R extends DedupeReadOrigin>(): PipeStep<R, R>;

export function dedupeRead$<D>(): PipeStep<DedupeReadOrigin<D>, DedupeReadOrigin<D>> {
  return (origin: DedupeReadOrigin<D>, { off }) => {
    const awaiter = dedupedAwaiter();

    const deduped = ref$<D>(() => awaiter.call(() => origin.read()));

    if ('mutate' in origin) {
      Object.assign(deduped, { mutate: origin.mutate });
    }

    off.add(origin.subscribe((value) => deduped.next(value)));

    return deduped;
  };
}