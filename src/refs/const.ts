import { Ref } from '../defs/index.js';
import { ref$ } from './ref.js';

// Builder
export function const$<const D>(value: D): Ref<D> {
  return ref$({ read: () => value });
}
