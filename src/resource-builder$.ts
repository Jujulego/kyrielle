import { Observable, Readable, Mutable } from './defs/index.js';

// Types
export type EmptyResource = Record<string, never>;
export type AddFeature<R, F> = Omit<R, keyof F> & F;

/**
 * Helper to build complex resource types.
 */
export interface ResourceBuilder<D, R extends object = EmptyResource> {
  /**
   * Adds defined mutable feature to built resource.
   * @param mutable
   */
  add<const F extends Mutable<any, D>>(mutable: F): ResourceBuilder<D, AddFeature<R, F>>; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Adds defined observable feature to built resource.
   * @param observable
   */
  add<const F extends Observable<D>>(observable: F): ResourceBuilder<D, AddFeature<R, F>>;

  /**
   * Add defined readable feature to built resource
   * @param readable
   */
  add<const F extends Readable<D>>(readable: F): ResourceBuilder<D, AddFeature<R, F>>;

  /**
   * Return final resource object.
   */
  build(): R;
}

/**
 * Helper to build complex resource types.
 */
export function resourceBuilder$<D>(): ResourceBuilder<D> {
  const resource: EmptyResource = {};

  return {
    add(feature: unknown): ResourceBuilder<D> {
      Object.assign(resource, feature);
      return this;
    },
    build() {
      return resource;
    }
  };
}
