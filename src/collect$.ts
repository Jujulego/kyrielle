import type { Subscribable } from './defs/index.js';
import type { PipeStep } from './pipe$.js';

/**
 * Collect all emitted items into an array, until observable complete
 */
export function collect$<T>(): PipeStep<Subscribable<T>, Promise<T[]>> {
  return (origin: Subscribable<T>) => new Promise<T[]>((resolve, reject) => {
    const result: T[] = [];

    origin.subscribe({
      next: (item) => result.push(item),
      error: reject,
      complete: () => resolve(result),
    });
  });
}