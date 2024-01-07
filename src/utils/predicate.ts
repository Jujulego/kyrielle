import { Mutable, Readable } from '../defs/index.js';

export function isMutable<M extends Mutable = Mutable>(obj: object): obj is M {
  return 'mutate' in obj;
}

export function isReadable<D = unknown>(obj: object): obj is Readable<D> {
  return 'read' in obj;
}
