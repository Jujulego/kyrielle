import { observable$, type SubscriberObserver } from './rx/observable$.js';
import type { Observable } from './rx/types/observable.js';
import type { MappingKey } from './types/mapping.js';
import type { ListenEventMap, StrictListenable } from './types/outputs/StrictListenable.js';

/**
 * Picks an event from a `StrictListenable` creating an observable
 *
 * @since 2.8.0
 */
export function pick$<L extends StrictListenable, K extends MappingKey<ListenEventMap<L>>>(
  listenable: L,
  key: K,
): Observable<ListenEventMap<L>[K]> {
  return observable$((observer, signal) => {
    const { unsubscribe } = listenable.on(key, observer as SubscriberObserver);
    signal.addEventListener('abort', unsubscribe, { once: true });
  });
}
