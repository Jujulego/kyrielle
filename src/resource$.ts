import { Awaitable, Mutable, Subscribable, Readable, ObservableHolder } from './defs/index.js';
import { isObservableHolder } from './utils/predicates.js';

// Types
export type ResourceFeature<D> =
  | Subscribable<D>
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
  add<F extends ResourceFeature<D>>(feature: F): ResourceBuilder<D, R & F>;

  /**
   * Adds subscribable feature based on given holder.
   * @param holder
   */
  add<F extends ObservableHolder<D>>(holder: F): ResourceBuilder<D, R & Subscribable<D>>;

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
    add(feature: unknown): ResourceBuilder<D> {
      if (isObservableHolder(feature)) {
        Object.assign(resource, feature[Symbol.observable ?? '@@observable']());
      } else {
        Object.assign(resource, feature);
      }

      return this as ResourceBuilder<D, ResourceFeature<D>>;
    },
    build() {
      return resource;
    }
  } as ResourceBuilder<D>;
}
