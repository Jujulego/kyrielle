import { Observable as Obs } from './defs/index.js';

// Types
export type PipeStep<in O extends Obs = Obs, out R extends Obs = Obs> = (origin: O) => R;

/**
 * Run step on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs>(observable: A, stepA: PipeStep<A, B>): B;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>
): C;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>
): D;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>
): E;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>
): F;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>
): G;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>
): H;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs>(
  observable: A,
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
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs>(
  observable: A,
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
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs, K extends Obs>(
  observable: A,
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
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 */
export function pipe$(observable: Obs, ...steps: PipeStep[]): Obs {
  return steps.reduce((obs, step) => step(obs), observable);
}
