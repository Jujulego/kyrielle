import { AsyncRef, Ref } from './ref.js';
import { AsyncMutable, Mutable } from '../features/mutable.js';

/**
 * Mutate data type limits
 */
export type AllowedMutateValue<D> = D
  | (D extends PromiseLike<infer P> ? P : PromiseLike<D>);

/**
 * Mutable reference
 */
export interface MutableRef<in out RD = unknown, out MD extends AllowedMutateValue<RD> = RD, in A = Awaited<MD>> extends Ref<RD>, Mutable<MD, A> {}

/**
 * Mutable asynchronous reference
 */
export interface AsyncMutableRef<in out RD = unknown, out MD extends RD = RD, in A = MD> extends AsyncRef<RD>, AsyncMutable<MD, A> {}
