/**
 * Objects receiving data
 */
export interface Receiver<in D = any> { // eslint-disable-line @typescript-eslint/no-explicit-any
  /**
   * Receive given data
   * @param data
   */
  next(data: D): void;
}

/**
 * Extract received value type from a receiver object.
 */
export type ReceivedValue<R extends Receiver> = R extends Receiver<infer D> ? D : never;
