import type { Deferrable } from './types/inputs/Deferrable.js';
import type { AnyIterable } from './types/inputs/MinimalIterator.js';
import type { Mutable } from './types/inputs/Mutable.js';
import type { Subscribable, SubscribableHolder } from './types/inputs/Subscribable.js';
import type { Awaitable } from './types/utils.js';
import { isIterable, isSubscribableHolder } from './utils/predicates.js';

// Types
export type ResourceFeature<D> =
  | AnyIterable<D>
  | Subscribable<D>
  | Deferrable<Awaitable<D>>
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
  add<F extends SubscribableHolder<D>>(holder: F): ResourceBuilder<D, R & Subscribable<D>>;

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
      if (isIterable(feature)) {
        Object.assign(resource, feature[Symbol.iterator]());
        Object.assign(resource, {
          [Symbol.iterator]: () => resource,
        });
      } else if (isSubscribableHolder(feature)) {
        Object.assign(resource, feature[Symbol.observable ?? '@@observable']());
        Object.assign(resource, {
          [Symbol.observable ?? '@@observable']: () => resource,
        });
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
