/**
 * Defines an object that can be mutated.
 *
 * This is an **input** type.
 *
 * @since 1.0.0
 * @see Mutator
 */
export interface Mutable<in A = unknown, out D = unknown> {
  /**
   * Mutates the object.
   * @param arg
   * @param signal Allows to abort an async operation.
   *
   * @since 1.0.0
   */
  mutate(arg: A, signal?: AbortSignal): D;
}
