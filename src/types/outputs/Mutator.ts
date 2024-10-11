import type { Mutable } from '../inputs/Mutable.js';

/**
 * Defines an object that can be mutated.
 *
 * This is an **output** type.
 *
 * @since 1.1.0
 * @see Mutable
 * @see mutable$
 * @see var$
 */
export interface Mutator<in A = any, out D = unknown> extends Mutable<A, D> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutates the object.
   * @param arg
   * @param signal Allows to abort an async operation.
   *
   * @since 1.1.0
   */
  mutate(this: void, arg: A, signal?: AbortSignal): D;
}