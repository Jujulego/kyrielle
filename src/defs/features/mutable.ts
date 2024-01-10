/**
 * Defines an object that can be mutated
 */
export interface Mutable<out D = unknown, in A = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Mutate current value
   */
  mutate(arg: A, signal?: AbortSignal): D;
}

/**
 * Defines an object that can be asynchronously mutated
 */
export interface AsyncMutable<out D = unknown, in A = any> extends Mutable<PromiseLike<D>, A> {} // eslint-disable-line @typescript-eslint/no-explicit-any

// Utils
/**
 * Extract mutate arg type
 */
export type MutateArg<M extends Mutable> = M extends Mutable<unknown, infer A> ? A : never;

/**
 * Extract mutate value type
 */
export type MutateValue<M extends Mutable> = M extends Mutable<infer D> ? Awaited<D> : never;
