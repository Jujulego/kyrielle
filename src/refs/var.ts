import { MutableRef } from '../defs/index.js';
import { ref$ } from './ref.js';

// Builder
export function var$<D>(): MutableRef<D | undefined, D, D>;
export function var$<D>(initial: D): MutableRef<D, D, D>;
export function var$<D>(initial?: D): MutableRef<D | undefined, D, D>;

export function var$<D>(initial?: D): MutableRef<D | undefined, D, D> {
  let data = initial;

  return ref$({
    read: (): D | undefined => data,
    mutate: (val: D): D => data = val,
  });
}
