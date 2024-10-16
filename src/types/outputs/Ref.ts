import type { Deferrable } from '../inputs/Deferrable.js';

/**
 * Defines a reference object, referencing a value stored elsewhere.
 *
 * @since 2.0.0
 * @see Deferrable
 * @see const$
 * @see deferrable$
 */
export interface Ref<out D = unknown> extends Deferrable<D> {
  /**
   * Access to "pointed" data.
   * @param signal Allows to abort an async operation.
   *
   * @since 2.0.0
   */
  defer(this: void, signal?: AbortSignal): D;
}

/**
 * Defines pointer like objects, asynchronously referencing a value stored elsewhere.
 *
 * @since 1.0.0
 */
export type AsyncRef<D = unknown> = Ref<PromiseLike<D>>;
