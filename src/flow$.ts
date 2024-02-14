import { Observable as Obs, ObservedValue, Observer, Subscription } from './defs/index.js';
import { PipeStep } from './pipe$.js';

/**
 * Given observer subscribes to result given observable.
 */
export function flow$<A extends Obs>(observable: A, observer: Observer<ObservedValue<A>>): Subscription;

/**
 * Run step on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  observer: Observer<ObservedValue<B>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  observer: Observer<ObservedValue<C>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  observer: Observer<ObservedValue<D>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  observer: Observer<ObservedValue<E>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  observer: Observer<ObservedValue<F>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  observer: Observer<ObservedValue<G>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  observer: Observer<ObservedValue<H>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  stepG: PipeStep<G, H>,
  stepH: PipeStep<G, I>,
  observer: Observer<ObservedValue<I>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs>(
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
  observer: Observer<ObservedValue<J>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs, K extends Obs>(
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
  observer: Observer<ObservedValue<K>>
): Subscription;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$(observable: Obs, ...rest: [...PipeStep[], observer: Observer]): Subscription {
  const observer = rest.pop() as Observer;
  return (rest as PipeStep[]).reduce((obs, step) => step(obs), observable).subscribe(observer);
}
