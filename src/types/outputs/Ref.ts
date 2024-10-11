import type { Deferrable } from '../inputs/Deferrable.js';

/**
 * Defines a reference object, referencing a value stored elsewhere.
 *
 * This is an **output** type.
 *
 * @since 1.1.0
 * @see Deferrable
 * @see const$
 * @see deferrable$
 */
export interface Ref<out D = unknown> extends Deferrable<D> {
  /**
   * Access to "pointed" data.
   * @param signal Allows to abort an async operation.
   *
   * @since 1.1.0
   */
  defer(this: void, signal?: AbortSignal): D;
}
