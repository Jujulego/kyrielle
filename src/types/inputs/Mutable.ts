/**
 * Defines an object that can be mutated.
 *
 * This is an **input** type.
 *
 * @since 1.0.0
 * @see Mutator
 */
export interface Mutable<in A = any, out D = unknown> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutates the object.
   * @param arg
   * @param signal Allows to abort an async operation.
   *
   * @since 1.0.0
   */
  mutate(arg: A, signal?: AbortSignal): D;
}
