/**
 * Object that can be read.
 */
export interface Readable<out D = unknown> {
  /**
   * Access to "pointed" data. Can receive a signal to abort request.
   * @param signal
   */
  read(signal?: AbortSignal): D;
}

/**
 * Object that can be asynchronously read.
 */
export interface AsyncReadable<out D = unknown> extends Readable<PromiseLike<D>> {}

/**
 * Extract value type from a Readable type
 */
export type ReadValue<R extends Readable> = R extends Readable<infer D> ? D : never;