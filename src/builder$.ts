import { Observable, Readable, Mutable } from './defs/index.js';

// Types
export type ResourceElement<D = unknown> =
  | Mutable<any, D> // eslint-disable-line @typescript-eslint/no-explicit-any
  | Observable<D>
  | Readable<D>;

export type ResourceElementType<E extends ResourceElement> =
  E extends Mutable<any, infer D> // eslint-disable-line @typescript-eslint/no-explicit-any
    ? D
    : E extends Observable<infer D>
      ? D
      : E extends Readable<infer D>
        ? D
        : never;

export interface ResourceBuilder<D, R = unknown> {
  add<const E extends ResourceElement<D>>(observable: E): ResourceBuilder<D, R & E>;
  combine(): R;
}

/**
 * Combines multiple coherent features to create a resource object
 */
export function builder$<const E extends ResourceElement>(element: E): ResourceBuilder<ResourceElementType<E>, E> {

}
