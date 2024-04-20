/**
 * Object that can be refreshed
 */
export interface Refreshable<out R = unknown> {
  /**
   * Refresh "pointed" data. Can receive a signal to abort request.
   * @param signal
   */
  refresh(signal?: AbortSignal): R
}

/**
 * Object that can be asynchronously refreshed.
 */
export interface AsyncRefreshable<out D = unknown> extends Refreshable<PromiseLike<D>> {}

/**
 * Extract value type from a Readable type
 */
export type RefreshValue<R extends Refreshable> = R extends Refreshable<infer D> ? D : never;