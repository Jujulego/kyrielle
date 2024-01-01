import { Observable as Obs } from '../defs/index.js';
import { off$, OffGroup } from '../subscriptions/index.js';

/**
 * Context passed to pipe steps
 */
export interface PipeContext {
  off: OffGroup;
}

/**
 * Step in pipe processing
 */
export type PipeStep<A extends Obs, B extends Obs> = (origin: A, context: PipeContext) => B;
type PS<A extends Obs, B extends Obs> = PipeStep<A, B>;

/**
 * Piped origin, result of pipe$
 */
export type PipedOrigin<O extends Obs = Obs> = O & {
  off(): void;
}

export function pipe$<A extends Obs>(obs: A): PipedOrigin<A>;
export function pipe$<A extends Obs, B extends Obs>(obs: A, opA: PS<A, B>): PipedOrigin<B>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>): PipedOrigin<C>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>): PipedOrigin<D>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>): PipedOrigin<E>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>): PipedOrigin<F>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>): PipedOrigin<G>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>): PipedOrigin<H>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>): PipedOrigin<I>;
export function pipe$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, opI: PS<I, J>): PipedOrigin<J>;

export function pipe$<O extends Obs>(obs: O, ...ops: PipeStep<O, O>[]): PipedOrigin<O>;

export function pipe$(obs: Obs, ...ops: PipeStep<Obs, Obs>[]): PipedOrigin {
  const off = off$();
  const out = ops.reduce((step, op) => op(step, { off }), obs);

  return Object.assign(out, { off });
}
