import { Mutable, Readable } from '../defs/index.js';

export function isMutable<D = unknown, A = unknown>(obj: object): obj is Mutable<D, A> {
  return 'mutate' in obj;
}

export function isReadable<D = unknown>(obj: object): obj is Readable<D> {
  return 'read' in obj;
}