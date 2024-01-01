import { Receiver, PipeStep as PS, PipeOrigin as PO, Observable as Obs, ObservedValue, OffFn } from '../defs/index.js';

import { pipe$ } from './pipe.js';

// Builder
type Rcv<A extends Obs> = Receiver<ObservedValue<A>>;

export function flow$<A extends Obs>(obs: A, rcv: Rcv<A>): OffFn;
export function flow$<A extends PO, B extends Obs>(obs: A, opA: PS<A, B>, rcv: Rcv<B>): OffFn;
export function flow$<A extends PO, B extends PO, C extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, rcv: Rcv<C>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, rcv: Rcv<D>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, rcv: Rcv<E>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, rcv: Rcv<F>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, rcv: Rcv<G>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, rcv: Rcv<H>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H extends PO, I extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, rcv: Rcv<I>): OffFn;
export function flow$<A extends PO, B extends PO, C extends PO, D extends PO, E extends PO, F extends PO, G extends PO, H extends PO, I extends PO, J extends Obs>(obs: A, opA: PS<A, B>, opB: PS<B, C>, opC: PS<C, D>, opD: PS<D, E>, opE: PS<E, F>, opF: PS<F, G>, opG: PS<G, H>, opH: PS<H, I>, opI: PS<I, J>, rcv: Rcv<J>): OffFn;

export function flow$(obs: Obs, ...rest: [...PS<Obs, Obs>[], rcv: Receiver]): OffFn {
  const rcv = rest.pop() as Receiver;
  const ops = rest as PS<Obs, Obs>[];

  const out = pipe$(obs, ...ops);
  return out.subscribe(rcv.next);
}
