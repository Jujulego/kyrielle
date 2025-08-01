/**
 * Ensure that the given type is a type mapping
 *
 * @since 1.0.0
 * @see Mapping
 */
export type AssertMapping<M> = M extends Mapping ? M : never;

/**
 * Mapping type with no key
 *
 * @since 2.4.0
 */
export type EmptyMapping = Record<never, unknown>;

/**
 * Mapping type
 *
 * @since 1.0.0
 */
export type Mapping = Record<string, unknown>;

/**
 * Extract keys from a type mapping
 *
 * @since 1.0.0
 */
export type MappingKey<M extends Mapping> = Extract<keyof M, string>;

/**
 * Overrides mapping B with values from mapping O
 *
 * @since 2.4.0
 */
export type OverrideMapping<B extends Mapping, O extends Mapping> = {
  [K in MappingKey<B> | MappingKey<O>]: K extends MappingKey<O> ? O[K] : B[K];
}

/**
 * Prepends the given key part to all type mapping's keys
 *
 * @since 1.0.0
 */
export type PrependMapping<P extends string, M extends Mapping> = {
  [K in MappingKey<M> as `${P}.${K}`]: M[K]
}
