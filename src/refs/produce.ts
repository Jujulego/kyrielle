import { Draft, Immer, produce } from 'immer';

import {
  AsyncMutable,
  AsyncReadable,
  Awaitable,
  Mutable,
  Readable,
  SyncMutable,
  SyncReadable
} from '../defs/index.js';
import { awaitedCall } from '../utils/index.js';

// Types
export type RecipeFn<D> = (draft: Draft<D>) => Draft<D> | void;

export interface ProducerOpts {
  /**
   * Custom instance of Immer to use. By default, it will use the global instance.
   */
  immer?: Immer;

  /**
   * Signal to give to read call
   */
  signal?: AbortSignal;
}

export function produce$<D>(ref: AsyncReadable<D> & AsyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): PromiseLike<D>;
export function produce$<D>(ref: AsyncReadable<D> & SyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): PromiseLike<D>;
export function produce$<D>(ref: AsyncReadable<D> & Mutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): PromiseLike<D>;

export function produce$<D>(ref: SyncReadable<D> & AsyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): PromiseLike<D>;
export function produce$<D>(ref: SyncReadable<D> & SyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): D;
export function produce$<D>(ref: SyncReadable<D> & Mutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): Awaitable<D>;

export function produce$<D>(ref: Readable<D> & AsyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): PromiseLike<D>;
export function produce$<D>(ref: Readable<D> & SyncMutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): Awaitable<D>;
export function produce$<D>(ref: Readable<D> & Mutable<D, D>, recipe: RecipeFn<D>, opts?: ProducerOpts): Awaitable<D>;

export function produce$<D>(ref: Readable<D> & Mutable<D, D>, recipe: RecipeFn<D>, opts: ProducerOpts = {}): Awaitable<D> {
  return awaitedCall(ref.mutate, awaitedCall((old: D) => (opts.immer?.produce ?? produce)(old, recipe), ref.read(opts.signal)));
}