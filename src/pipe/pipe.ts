import { PipeOrigin as PO, PipeStep as PS } from '../defs/index.js';

export function pipe$<A extends PO, B>(obs: A, opA: PS<A, B>): B;
export function pipe$<A extends PO, B extends PO, C>(obs: A, opA: PS<A, B>, opB: PS<B, C>): C;
export function pipe$<A extends PO, B extends PO, C extends PO, D>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>): D;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>): E;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>): F;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>): G;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>): H;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H extends PO, I>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>): I;
export function pipe$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H extends PO, I extends PO, J>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, opI: PS<I, J>): J;

export function pipe$<O extends PO>(obs: O, ...ops: PS<O, O>[]): O;

export function pipe$(obs: PO, ...ops: PS<PO, PO>[]): PO {
  return ops.reduce((step, op) => op(step), obs);
}
