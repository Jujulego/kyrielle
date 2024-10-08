import type { Ref } from './types/outputs/Ref.js';

/**
 * Returns a Ref always returning the same value.
 *
 * @param value contained value
 *
 * @since 1.0.0
 */
export function const$<D>(value: D): Ref<D> {
  return { defer: () => value };
}
