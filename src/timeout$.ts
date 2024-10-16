import type { Ref } from './types/outputs/Ref.js';

/**
 * Utility building a ref taking ms milliseconds to defer.
 *
 * @since 1.0.0
 */
export function timeout$(ms: number): Ref<Promise<void>> {
  return {
    defer: (signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
      const id = setTimeout(() => {
        signal?.removeEventListener('abort', handleAbort);
        resolve();
      }, ms);

      function handleAbort(this: AbortSignal) {
        clearTimeout(id);
        reject(this.reason as Error);
      }

      signal?.addEventListener('abort', handleAbort, { once: true });
    })
  };
}
