/**
 * Defines an object that can be mutated.
 *
 * @since 1.0.0
 * @see Mutator
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Mutable<in A = any, out D = unknown> {
  /**
   * Mutates the object.
   * @param arg
   * @param signal Allows to abort an async operation.
   *
   * @since 1.0.0
   */
  mutate(arg: A, signal?: AbortSignal): D;
}

/**
 * Defines an object that can be asynchronously mutated.
 *
 * @since 1.0.0
 */
export type AsyncMutable<A = unknown, D = unknown> = Mutable<A, PromiseLike<D>>;
