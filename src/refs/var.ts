import { SyncMutable, SyncRef } from '../defs/index.js';
import { ref$ } from './ref.js';

// Builder
export function var$<D>(): SyncRef<D | undefined> & SyncMutable<D, D>;
export function var$<D>(initial: D): SyncRef<D> & SyncMutable<D, D>;
export function var$<D>(initial?: D): SyncRef<D | undefined> & SyncMutable<D, D>;

export function var$<D>(initial?: D): SyncRef<D | undefined> & SyncMutable<D, D> {
  let data = initial;

  return ref$({
    read: (): D | undefined => data,
    mutate: (val: D): D => data = val,
  });
}
