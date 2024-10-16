/**
 * Run step on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B>(value: A, stepA: PipeStep<A, B>): B;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>
): C;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>
): D;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>
): E;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>
): F;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F, G>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>
): G;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F, G, H>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>
): H;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F, G, H, I>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>
): I;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F, G, H, I, J>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>,
  stepI: PipeStep<I, J>
): J;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$<A, B, C, D, E, F, G, H, I, J, K>(
  value: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>,
  stepI: PipeStep<I, J>,
  stepJ: PipeStep<J, K>
): K;

/**
 * Runs all steps one after another on input value allowing to change its shape or emitted data.
 *
 * @since 1.0.0
 */
export function pipe$(value: unknown, ...steps: PipeStep[]): unknown {
  return steps.reduce((val, step) => step(val), value);
}

// Types
export type PipeStep<in O = unknown, out R = unknown> = (origin: O) => R;
