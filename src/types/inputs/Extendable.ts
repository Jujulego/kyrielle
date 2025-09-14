/**
 * Defines objects in which elements can be pushed, like arrays.
 *
 * @since 2.6.0
 */
export interface Pushable<in D = unknown> {
  /**
   * Adds given item in the element
   * @param item
   */
  push(item: D): void;
}

/**
 * Defines objects in which elements can be added, like sets.
 *
 * @since 2.6.0
 */
export interface Addable<in D = unknown> {
  /**
   * Adds given item in the element
   * @param item
   */
  add(item: D): void;
}

/**
 * Defines objects in which elements can be either added or pushed.
 *
 * @since 2.6.0
 */
export type Extendable<D = unknown> = Pushable<D> | Addable<D>;

export type AnyExtendable<D = any> = Extendable<D>; // eslint-disable-line @typescript-eslint/no-explicit-any
