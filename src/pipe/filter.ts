import { Observable as Obs, PipeStep } from '../defs/index.js';
import { source$ } from '../source.js';

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<DA, DB extends DA>(predicate: (arg: DA) => arg is DB): PipeStep<Obs<DA>, Obs<DB>>;

/**
 * Filters emitted values using given predicate
 * @param predicate
 */
export function filter$<D>(predicate: (arg: D) => boolean): PipeStep<Obs<D>, Obs<D>>;

export function filter$<D>(predicate: (arg: D) => boolean): PipeStep<Obs<D>, Obs<D>> {
  return (obs: Obs<D>) => {
    const out = source$<D>();

    obs.subscribe((data) => {
      if (predicate(data)) {
        out.next(data);
      }
    });

    return out;
  };
}
