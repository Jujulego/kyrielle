import { Observable, Readable, Mutable, Awaitable } from './defs/index.js';

// Types
export type ResourceFeature<D> =
  | Observable<D>
  | Readable<Awaitable<D>>
  | Mutable<any, Awaitable<D>>; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Helper to build complex resource types.
 */
export interface ResourceBuilder<D, R = unknown> {
  /**
   * Adds defined feature to resource.
   * @param feature
   */
  add<const F extends ResourceFeature<D>>(feature: F): ResourceBuilder<D, R & F>;

  /**
   * Return final resource object.
   */
  build(): R;
}

/**
 * Helper to build complex resource types.
 */
export function resource$<D>(): ResourceBuilder<D> {
  const resource: object = {};

  return {
    add<F extends ResourceFeature<D>>(feature: F): ResourceBuilder<D, F> {
      Object.assign(resource, feature);
      return this as ResourceBuilder<D, F>;
    },
    build() {
      return resource;
    }
  };
}
