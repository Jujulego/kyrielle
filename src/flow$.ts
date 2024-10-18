import type { PipeStep } from './pipe$.js';
import type { PartialObserver } from './types/inputs/Observer.js';
import type { Subscribable } from './types/inputs/Subscribable.js';
import type { Unsubscribable } from './types/inputs/Unsubscribable.js';

/**
 * Given observer subscribes to result given observable.
 *
 * @since 1.0.0
 */
export function flow$<A extends Subscribable>(observable: A, observer: FlowObserver<A>): ReturnType<A['subscribe']>;

/**
 * Run step on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  observer: FlowObserver<B>
): ReturnType<B['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  observer: FlowObserver<C>
): ReturnType<C['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  observer: FlowObserver<D>
): ReturnType<D['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  observer: FlowObserver<E>
): ReturnType<E['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  observer: FlowObserver<F>
): ReturnType<F['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F, G extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  observer: FlowObserver<G>
): ReturnType<G['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F, G, H extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  observer: FlowObserver<H>
): ReturnType<H['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F, G, H, I extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>,
  observer: FlowObserver<I>
): ReturnType<I['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F, G, H, I, J extends Subscribable>(
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
  observer: FlowObserver<J>
): ReturnType<J['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$<A, B, C, D, E, F, G, H, I, J, K extends Subscribable>(
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
  stepJ: PipeStep<J, K>,
  observer: FlowObserver<K>
): ReturnType<K['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 *
 * @since 1.0.0
 */
export function flow$(value: unknown, ...rest: [...PipeStep[], observer: PartialObserver]): Unsubscribable {
  const observer = rest.pop() as PartialObserver;
  return ((rest as PipeStep[]).reduce((obs, step) => step(obs), value) as Subscribable).subscribe(observer);
}

/**
 * Extract Value type from {@link Subscribable} type
 *
 * @since 2.0.0
 */
export type FlowObserver<T extends Subscribable> = T extends Subscribable<infer D> ? PartialObserver<D> : never;
