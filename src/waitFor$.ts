import type { Listenable, ListenEventMap, MappingKey, ObservedValue, Subscribable } from './defs/index.js';
import { once$ } from './once$.js';

/**
 * Returns a promise resolving to next emitted result, or reject to the next error
 * @param observable
 */
export function waitFor$<O extends Subscribable>(observable: O): Promise<ObservedValue<O>>;
export function waitFor$<L extends Listenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K): Promise<ListenEventMap<L>[K]>;

export function waitFor$(...args: [Subscribable] | [Listenable, string]): Promise<unknown> {
  return new Promise((resolve, reject) => once$(...args, { next: resolve, error: reject }));
}