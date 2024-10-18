import type { PipeStep } from './pipe$.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import { extractSubscribable } from './utils/subscribable.js';

/**
 * Collect all emitted items into an array, until observable complete
 *
 * @since 1.0.0
 */
export function collect$<T>(): PipeStep<AnySubscribable<T>, Promise<T[]>> {
  return (origin: AnySubscribable<T>) => new Promise<T[]>((resolve, reject) => {
    const result: T[] = [];

    extractSubscribable(origin).subscribe({
      next: (item) => result.push(item),
      error: reject,
      complete: () => resolve(result),
    });
  });
}
