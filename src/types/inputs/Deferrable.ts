/**
 * Defines pointer like objects, referencing a value stored elsewhere.
 *
 * @since 1.0.0
 * @see Ref
 */
export interface Deferrable<out D = unknown> {
  /**
   * Access to "pointed" data.
   * @param signal Allows to abort an async operation.
   *
   * @since 1.0.0
   */
  defer(signal?: AbortSignal): D;
}

/**
 * Defines pointer like objects, asynchronously referencing a value stored elsewhere.
 *
 * @since 1.0.0
 */
export type AsyncDeferrable<D = unknown> = Deferrable<PromiseLike<D>>;
