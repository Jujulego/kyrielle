import { Observable as Obs, Source } from '../defs/index.js';
import { source$ } from '../source.js';

import { PipeStep } from './pipe.js';

// Operator
export function filter$<DA, DB extends DA>(fn: (arg: DA) => arg is DB): PipeStep<Obs<DA>, Source<DB>>;

export function filter$<D>(fn: (arg: D) => boolean): PipeStep<Obs<D>, Source<D>>;

export function filter$<D>(fn: (arg: D) => boolean): PipeStep<Obs<D>, Source<D>> {
  return (obs: Obs<D>, { off }) => {
    const out = source$<D>();

    off.add(obs.subscribe((data) => {
      if (fn(data)) {
        out.next(data);
      }
    }));

    return out;
  };
}
