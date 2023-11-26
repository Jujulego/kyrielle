import { Awaitable } from '../common.js';

/**
 * Defines an object that can be read
 */
export interface Readable<out D = unknown> {
  /**
   * Return current value
   */
  read(): Awaitable<D>;
}

/**
 * Defines an object that can be synchronously read
 */
export interface SyncReadable<out D = unknown> extends Readable<D> {
  /**
   * Return current value
   */
  read(): D;
}

/**
 * Defines an object that can be asynchronously read
 */
export interface AsyncReadable<out D = unknown> extends Readable<D> {
  /**
   * Return current value asynchronously
   */
  read(): PromiseLike<D>;
}

// Utils
/**
 * Extract read value type
 */
export type ReadValue<R extends Readable> =
  R extends Readable<infer D>
    ? D
    : R extends AsyncReadable<infer D>
      ? D
      : R extends SyncReadable<infer D>
        ? D
        : never;

/**
 * Build a Readable type with the same synchronicity and the given value type
 */
export type CopyReadableSynchronicity<R extends Readable, D> =
  R extends AsyncReadable
    ? AsyncReadable<D>
    : R extends SyncReadable<infer SD>
      ? Extract<SD, PromiseLike<unknown>> extends never
        ? SyncReadable<D>
        : Readable<D>
      : never;
