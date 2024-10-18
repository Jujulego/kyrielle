/**
 * Ensure that the given type is a type mapping
 *
 * @since 1.0.0
 * @see Mapping
 */
export type AssertMapping<M> = M extends Mapping ? M : never;

/**
 * Type mapping
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
 * Prepends the given key part to all type mapping's keys
 *
 * @since 1.0.0
 */
export type PrependMapping<P extends string, M extends Mapping> = {
  [K in MappingKey<M> as `${P}.${K}`]: M[K]
}
