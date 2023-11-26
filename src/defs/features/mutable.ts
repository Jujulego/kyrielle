import { Awaitable } from '../common.js';

/**
 * Defines an object that can be mutated
 */
export interface Mutable<out D = unknown, in A = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutate current value
   */
  mutate(arg: A): Awaitable<D>;
}

/**
 * Defines an object that can be synchronously mutated
 */
export interface SyncMutable<out D = unknown, in A = any> extends Mutable<D, A> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutate current value synchronously
   */
  mutate(arg: A): D;
}

/**
 * Defines an object that can be asynchronously mutated
 */
export interface AsyncMutable<out D = unknown, in A = any> extends Mutable<D, A> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutate current value asynchronously
   */
  mutate(arg: A): PromiseLike<D>;
}

// Utils
/**
 * Extract mutate value type
 */
export type MutateArg<M extends Mutable> = M extends Mutable<unknown, infer A> ? A : never;

/**
 * Build a Mutable type with the same synchronicity and the given value type
 */
export type CopyMutableSynchronicity<M extends Mutable, D, A> =
  M extends AsyncMutable
    ? AsyncMutable<D, A>
    : M extends SyncMutable<infer SD>
      ? Extract<SD, PromiseLike<unknown>> extends never
        ? SyncMutable<D, A>
        : Mutable<D, A>
      : never;
