import { Readable } from './defs/index.js';

/**
 * Utility building a readable taking ms milliseconds to complete
 */
export function timeout$(ms: number): Readable<Promise<void>> {
  return {
    read(signal?: AbortSignal): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, ms);

        signal?.addEventListener('abort', function () {
          clearTimeout(id);
          reject(this.reason);
        });
      });
    }
  };
}
