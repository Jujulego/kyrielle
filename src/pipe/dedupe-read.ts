import { Observable, PipeStep, Readable } from '../defs/index.js';
import { dedupedAwaiter } from '../utils/index.js';

// Types
export interface DedupeReadOrigin<out D = unknown> extends Readable<D>, Partial<Observable<D>> {}

/**
 * Deduplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 */
export function dedupeRead$<R extends DedupeReadOrigin>(): PipeStep<R, R>;

export function dedupeRead$<D>(): PipeStep<DedupeReadOrigin<D>, DedupeReadOrigin<D>> {
  return (origin: DedupeReadOrigin<D>) => {
    const awaiter = dedupedAwaiter();
    const originalRead = origin.read.bind(origin);

    return Object.assign(origin, {
      read: (signal?: AbortSignal) => awaiter.call(() => originalRead(signal), signal)
    });
  };
}