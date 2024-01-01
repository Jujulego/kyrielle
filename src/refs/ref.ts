import {
  AsyncMutable,
  AsyncReadable, AsyncRef, Awaitable,
  Mutable,
  Readable, Ref,
  SyncMutable,
  SyncReadable, SyncRef
} from '../defs/index.js';
import { source$ } from '../source.js';
import { awaitedCall } from '../utils/promise.js';

// Types
export type RefFn<D = unknown> = (signal?: AbortSignal) => Awaitable<D>;
export type SyncRefFn<D = unknown> = () => D;
export type AsyncRefFn<D = unknown> = (signal?: AbortSignal) => PromiseLike<D>;

export type RefOpts<RD = unknown, MD extends RD = RD, A = MD> = Readable<RD> & Partial<Mutable<MD, A>>

// Utils
function parseArg<RD, MD extends RD, A>(arg: RefFn<RD> | RefOpts<RD, MD, A>): RefOpts<RD, MD, A> {
  return typeof arg === 'function' ? { read: arg } : arg;
}

// Builder
export function ref$<RD, MD extends RD = RD, A = MD>(opts: AsyncReadable<RD> & AsyncMutable<MD, A>): AsyncRef<RD> & AsyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: AsyncReadable<RD> & SyncMutable<RD, A>): AsyncRef<RD> & SyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: AsyncReadable<RD> & Mutable<MD, A>): AsyncRef<RD> & Mutable<MD, A>;

export function ref$<RD, MD extends RD = RD, A = MD>(opts: SyncReadable<RD> & AsyncMutable<MD, A>): SyncRef<RD> & AsyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: SyncReadable<RD> & SyncMutable<MD, A>): SyncRef<RD> & SyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: SyncReadable<RD> & Mutable<MD, A>): SyncRef<RD> & Mutable<MD, A>;

export function ref$<RD, MD extends RD = RD, A = MD>(opts: Readable<RD> & AsyncMutable<MD, A>): Ref<RD> & AsyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: Readable<RD> & SyncMutable<MD, A>): Ref<RD> & SyncMutable<MD, A>;
export function ref$<RD, MD extends RD = RD, A = MD>(opts: Readable<RD> & Mutable<MD, A>): Ref<RD> & Mutable<MD, A>;

export function ref$<D>(opts: AsyncReadable<D>): AsyncRef<D>;
export function ref$<D>(opts: SyncReadable<D>): SyncRef<D>;
export function ref$<D>(opts: Readable<D>): Ref<D>;

export function ref$<D>(fn: AsyncRefFn<D>): AsyncRef<D>;
export function ref$<D>(fn: SyncRefFn<D>): SyncRef<D>;
export function ref$<D>(fn: RefFn<D>): Ref<D>;

export function ref$<RD, MD extends RD = RD, A = MD>(opts: RefOpts<RD, MD, A>): Ref<RD> & Mutable<MD, A>;

export function ref$<RD, MD extends RD = RD, A = MD>(arg: RefFn<RD> | RefOpts<RD, MD, A>): Ref<RD> {
  const opts = parseArg<RD, MD, A>(arg);
  const events = source$<RD>();

  // Handle emits
  let last: RD | undefined;

  function emit(val: RD) {
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
    next: (val: RD) => { emit(val); },
    read: (signal?: AbortSignal) => awaitedCall(emit, opts.read(signal))
  };

  // Add options ;)
  if ('mutate' in opts) {
    return Object.assign(ref, {
      mutate: (arg: A) => awaitedCall(emit, opts.mutate!(arg))
    });
  }

  return ref;
}
