import { AsyncMutable, AsyncReadable, Observable, PipeStep } from '../defs/index.js';
import { dedupedAwaiter } from '../utils/index.js';
import { isMutable } from '../utils/predicate.js';

// Types
export type DedupablicableMethod = 'read' | 'mutate' | 'both';

export interface DeduplicableReadableOrigin<out D = unknown> extends AsyncReadable<D>, Partial<Observable<D>> {}
export interface DeduplicableMutableOrigin<out D = unknown, in A = D> extends AsyncReadable<D>, AsyncMutable<D, A>, Partial<Observable<D>> {}
export interface DeduplicableOrigin<out D = unknown, in A = D> extends AsyncReadable<D>, Partial<Observable<D> & AsyncMutable<D, A>> {}

/**
 * De-duplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 */
export function deduplicate$<R extends DeduplicableReadableOrigin>(method: 'read'): PipeStep<R, R>;

/**
 * De-duplicates calls to origin's selected methods.
 *
 * If read or mutate is called again while another call on the same method is pending, it won't be called again
 * and its result will be returned to every caller.
 */
export function deduplicate$<R extends DeduplicableMutableOrigin>(method: DedupablicableMethod): PipeStep<R, R>;

export function deduplicate$<D, A>(method: DedupablicableMethod): PipeStep<DeduplicableOrigin<D, A>, DeduplicableOrigin<D, A>> {
  return (origin: DeduplicableOrigin<D, A>) => {
    if (['read', 'both'].includes(method)) {
      const awaiter = dedupedAwaiter();
      const originalRead = origin.read.bind(origin);

      Object.assign(origin, {
        read: (signal?: AbortSignal) => awaiter.call(() => originalRead(signal), signal)
      });
    }

    if (isMutable<AsyncMutable<D, A>>(origin) && ['mutate', 'both'].includes(method)) {
      const awaiter = dedupedAwaiter();
      const originalMutate = origin.mutate.bind(origin);

      Object.assign(origin, {
        mutate: (arg: A, signal?: AbortSignal) => awaiter.call(() => originalMutate(arg, signal), signal)
      });
    }

    return origin;
  };
}

/**
 * De-duplicates calls to origin's read method.
 *
 * If read is called again while another read is pending, origin's read won't be called again
 * and its result will be returned to every caller.
 *
 * @deprecated Use `deduplicate$('read')` instead
 */
export function dedupeRead$<R extends DeduplicableReadableOrigin>() {
  return deduplicate$<R>('read');
}
