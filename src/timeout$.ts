import { Readable } from './defs/index.js';

/**
 * Utility building a readable taking ms milliseconds to complete
 */
export function timeout$(ms: number): Readable<Promise<void>> {
  return {
    read(signal?: AbortSignal): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const id = setTimeout(() => {
          signal?.removeEventListener('abort', handleAbort);
          resolve();
        }, ms);

        function handleAbort(this: AbortSignal) {
          clearTimeout(id);
          reject(this.reason);
        }

        signal?.addEventListener('abort', handleAbort, { once: true });
      });
    }
  };
}
