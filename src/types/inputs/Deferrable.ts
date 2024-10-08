/**
 * Defines pointer like objects, referencing a value stored elsewhere.
 *
 * This is an **input** type.
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
