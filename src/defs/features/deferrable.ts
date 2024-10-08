/**
 * Object that can be deferred.
 */
export interface Deferrable<out D = unknown> {
  /**
   * Access to "pointed" data. Can receive a signal to abort request.
   * @param signal
   */
  defer(signal?: AbortSignal): D;
}

/**
 * Object that can be asynchronously deferred.
 */
export interface AsyncDeferrable<out D = unknown> extends Deferrable<PromiseLike<D>> {}

/**
 * Extract value type from a Deferrable type
 */
export type DeferredValue<R extends Deferrable> = R extends Deferrable<infer D> ? D : never;
