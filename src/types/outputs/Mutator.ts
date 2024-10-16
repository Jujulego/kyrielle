import type { Mutable } from '../inputs/Mutable.js';

/**
 * Defines an object that can be mutated.
 *
 * @since 2.0.0
 * @see Mutable
 * @see mutable$
 * @see var$
 */
export interface Mutator<in A = unknown, out D = unknown> extends Mutable<A, D> {
  /**
   * Mutates the object.
   * @param arg
   * @param signal Allows to abort an async operation.
   *
   * @since 2.0.0
   */
  mutate(this: void, arg: A, signal?: AbortSignal): D;
}

/**
 * Defines an object that can be asynchronously mutated.
 *
 * @since 2.0.0
 */
export type AsyncMutator<A = unknown, D = unknown> = Mutator<A, PromiseLike<D>>;
