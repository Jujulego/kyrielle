/**
 * Object that can be mutated.
 */
export interface Mutable<in A = any, out D = unknown> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutates object. Can receive a signal to abort mutation.
   * @param arg
   * @param signal
   */
  mutate(arg: A, signal?: AbortSignal): D;
}

/**
 * Object that can be asynchronously mutated.
 */
export interface AsyncMutable<in A = any, out D = unknown> extends Mutable<A, PromiseLike<D>> {} // eslint-disable-line @typescript-eslint/no-explicit-any