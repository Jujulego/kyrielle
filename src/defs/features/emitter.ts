/**
 * Objects emitting data
 */
export interface Emitter<in D = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Emits given data
   * @param data
   */
  next(data: D): void;
}

/**
 * Extract emitted value from an emitter object.
 */
export type EmittedValue<E extends Emitter> = E extends Emitter<infer D> ? D : never;
