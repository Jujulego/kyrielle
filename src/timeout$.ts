import type { Deferrable } from './defs/index.js';

/**
 * Utility building a deferrable taking ms milliseconds to complete
 */
export function timeout$(ms: number): Deferrable<Promise<void>> {
  return {
    defer(signal?: AbortSignal): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const id = setTimeout(() => {
          signal?.removeEventListener('abort', handleAbort);
          resolve();
        }, ms);

        function handleAbort(this: AbortSignal) {
          clearTimeout(id);
          reject(this.reason as Error);
        }

        signal?.addEventListener('abort', handleAbort, { once: true });
      });
    }
  };
}
