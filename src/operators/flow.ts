import { Emitter, Observable as Obs, ObservedValue } from '../defs/index.js';
import { off$, OffGroup } from '../subscriptions/index.js';

import { PipeStep } from './pipe.js';

// Builder
type PS<A extends Obs, B extends Obs> = PipeStep<A, B>;
type Rcv<A extends Obs> = Emitter<ObservedValue<A>>;

export function flow$<A extends Obs>(obs: A, rcv: Rcv<A>): OffGroup;
export function flow$<A extends Obs, B extends Obs>(obs: A, opA: PS<A, B>, rcv: Rcv<B>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, rcv: Rcv<C>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, rcv: Rcv<D>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, rcv: Rcv<E>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, rcv: Rcv<F>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, rcv: Rcv<G>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, rcv: Rcv<H>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, rcv: Rcv<I>): OffGroup;
export function flow$<A extends Obs, B extends Obs, C extends Obs, D extends Obs, E extends Obs, F extends Obs, G extends Obs, H extends Obs, I extends Obs, J extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, opI: PS<I, J>, rcv: Rcv<J>): OffGroup;

export function flow$(obs: Obs, ...rest: [...PipeStep<Obs, Obs>[], rcv: Emitter]): OffGroup {
  const rcv = rest.pop() as Emitter;
  const ops = rest as PipeStep<Obs, Obs>[];

  const off = off$();
  const out = ops.reduce((step, op) => op(step, { off }), obs);
  off.add(out.subscribe(rcv.next));

  return off;
}
