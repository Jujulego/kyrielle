import type { PipeStep } from './pipe$.js';

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B>(
  stepA: PipeStep<A, B>
): PipeStep<A, B>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>
): PipeStep<A, C>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>
): PipeStep<A, D>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>
): PipeStep<A, E>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>
): PipeStep<A, F>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F, G>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>
): PipeStep<A, G>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F, G, H>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>
): PipeStep<A, H>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F, G, H, I>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>
): PipeStep<A, I>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F, G, H, I, J>(
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>,
  stepI: PipeStep<I, J>
): PipeStep<A, J>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$<A, B, C, D, E, F, G, H, I, J, K>(
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
): PipeStep<A, K>;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 * @internal
 */
export function step$(...steps: PipeStep[]): PipeStep;

/**
 * Combines multiple steps into one
 *
 * @since 2.9.0
 */
export function step$(...steps: PipeStep[]): PipeStep {
  return (value) => steps.reduce((val, step) => step(val), value);
}
