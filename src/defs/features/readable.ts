/**
 * Defines an object that can be read
 */
export interface Readable<out D = unknown> {
  /**
   * Return current value
   */
  read(signal?: AbortSignal): D;
}

/**
 * Defines an object that can be asynchronously read
 */
export interface AsyncReadable<out D = unknown> extends Readable<PromiseLike<D>> {}

// Utils
/**
 * Extract read value type
 */
export type ReadValue<R extends Readable> = Awaited<ReturnType<R['read']>>;
