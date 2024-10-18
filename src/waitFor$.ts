import { once$ } from './once$.js';
import type { Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { MappingKey } from './types/mapping.js';
import type { ListenEventMap, StrictListenable } from './types/outputs/StrictListenable.js';

/**
 * Returns a promise resolving to next emitted result, or reject to the next error
 * @param observable
 *
 * @since 1.0.0
 */
export function waitFor$<O extends Subscribable>(observable: O): Promise<SubscribableValue<O>>;
export function waitFor$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(listenable: L, key: K): Promise<ListenEventMap<L>[K]>;

export function waitFor$(...args: [Subscribable] | [StrictListenable, string]): Promise<unknown> {
  return new Promise((resolve, reject) => once$(...args, { next: resolve, error: reject }));
}