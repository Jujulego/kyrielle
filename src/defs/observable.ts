import { Listener, OffFn } from './common.js';

/**
 * Object that can be observed
 */
export interface Observable<D = unknown> {
  /**
   * Subscribe listener to object event
   * @param listener
   */
  subscribe(listener: Listener<D>): OffFn;

  /**
   * Unsubscribe listener from object event
   * @param listener
   */
  unsubscribe(listener: Listener<D>): void;

  /**
   * Unsubscribe all listeners
   */
  clear(): void;
}

/**
 * Extract observed value from an observable object.
 */
export type ObservedValue<O extends Observable> = O extends Observable<infer D> ? D : never;