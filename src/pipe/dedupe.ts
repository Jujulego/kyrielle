import { Observable, PipeStep, Readable } from '../defs/index.js';
import { dedupedAwaiter } from '../utils/index.js';

// Types
export type DedupableMethod = 'read';

export interface DedupableReadableOrigin<out D = unknown> extends Readable<D>, Partial<Observable<D>> {}

/**
 * Deduplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 */
export function dedupe$<R extends DedupableReadableOrigin>(method: DedupableReadableOrigin): PipeStep<R, R>;

export function dedupe$<D>(method: DedupableReadableOrigin): PipeStep<DedupableReadableOrigin<D>, DedupableReadableOrigin<D>> {
  return (origin: DedupableReadableOrigin<D>) => {
    const awaiter = dedupedAwaiter();
    const originalRead = origin.read.bind(origin);

    return Object.assign(origin, {
      read: (signal?: AbortSignal) => awaiter.call(() => originalRead(signal), signal)
    });
  };
}

/**
 * Deduplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 *
 * @deprecated Use `dedupe$('read')` instead
 */
export function dedupeRead$<R extends DedupableReadableOrigin>() {
  return dedupe$<R>('read');
}
