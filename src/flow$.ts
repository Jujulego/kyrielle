import { ObservedValue, Observer, Subscribable, Unsubscribable } from './defs/index.js';
import { PipeStep } from './pipe$.js';

/**
 * Given observer subscribes to result given observable.
 */
export function flow$<A extends Subscribable>(observable: A, observer: Partial<Observer<ObservedValue<A>>>): ReturnType<A['subscribe']>;

/**
 * Run step on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  observer: Partial<Observer<ObservedValue<B>>>
): ReturnType<B['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B, C extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  observer: Partial<Observer<ObservedValue<C>>>
): ReturnType<C['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B, C, D extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  observer: Partial<Observer<ObservedValue<D>>>
): ReturnType<D['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B, C, D, E extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  observer: Partial<Observer<ObservedValue<E>>>
): ReturnType<E['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B, C, D, E, F extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  observer: Partial<Observer<ObservedValue<F>>>
): ReturnType<F['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$<A, B, C, D, E, F, G extends Subscribable>(
  observable: A,
  stepA: PipeStep<A, B>,
  stepB: PipeStep<B, C>,
  stepC: PipeStep<C, D>,
  stepD: PipeStep<D, E>,
  stepE: PipeStep<E, F>,
  stepF: PipeStep<F, G>,
  observer: Partial<Observer<ObservedValue<G>>>
): ReturnType<G['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
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
  observer: Partial<Observer<ObservedValue<H>>>
): ReturnType<H['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
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
  observer: Partial<Observer<ObservedValue<I>>>
): ReturnType<I['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
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
  observer: Partial<Observer<ObservedValue<J>>>
): ReturnType<J['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
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
  observer: Partial<Observer<ObservedValue<K>>>
): ReturnType<K['subscribe']>;

/**
 * Runs all steps one after another on input observable allowing to change its shape or emitted data.
 * Then given observer will subscribe to result observable.
 */
export function flow$(value: unknown, ...rest: [...PipeStep[], observer: Partial<Observer>]): Unsubscribable {
  const observer = rest.pop() as Partial<Observer>;
  return ((rest as PipeStep[]).reduce((obs, step) => step(obs), value) as Subscribable).subscribe(observer);
}
