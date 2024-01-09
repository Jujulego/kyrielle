import { AllowedMutateValue, Mutable, MutableRef, Readable, Ref } from '../defs/index.js';
import { source$ } from '../events/source.js';
import { isMutable } from '../utils/predicate.js';
import { awaitedChain } from '../utils/promise.js';

// Types
export interface RefOpts<out RD, out MD extends AllowedMutateValue<RD>, in A> extends Readable<RD>, Partial<Mutable<MD, A>> {}

/**
 * Builds a mutable ref from given read and mutate functions
 * @param opts
 */
export function ref$<RD, MD extends AllowedMutateValue<RD>, A>(opts: Readable<RD> & Mutable<MD, A>): MutableRef<RD, MD, A>;

/**
 * Builds a ref from given read functions
 * @param opts
 */
export function ref$<D>(opts: Readable<D>): Ref<D>;

/**
 * Builds a mutable ref from given read and mutate functions
 * @param opts
 */
export function ref$<RD, MD extends AllowedMutateValue<RD>, A>(opts: RefOpts<RD, MD, A>): Ref<RD> | MutableRef<RD, MD, A>;

export function ref$<RD, A>(opts: RefOpts<RD, RD, A>): Ref<RD> | MutableRef<RD, RD, A> {
  const events = source$<Awaited<RD>>();

  // Handle emits
  let last: Awaited<RD> | undefined;

  function emit(val: Awaited<RD>) {
    if (val !== last && val !== undefined) {
      last = val;
      events.next(val);
    }

    return val;
  }

  const ref = {
    // Events
    subscribe: events.subscribe,
    unsubscribe: events.unsubscribe,
    clear: events.clear,

    // Reference
    next: (val: Awaited<RD>) => { emit(val); },
    read: (signal?: AbortSignal) => awaitedChain(opts.read(signal), emit)
  };

  // Add options ;)
  if (isMutable<Mutable<RD, A>>(opts)) {
    return Object.assign(ref, {
      mutate: (arg: A, signal?: AbortSignal) => awaitedChain(opts.mutate(arg, signal), emit)
    });
  }

  return ref;
}
