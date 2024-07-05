import { Mapping, Multiplexer, Observer, SubscribeCallbacks, Unsubscribable } from '../defs/index.js';
import { splitKey } from '../utils/key.js';
import { isEmitter, isListenable, isMinimalObserver, isPartialObserver, isSubscribable } from '../utils/predicates.js';
import { parseSubscribeArgs } from '../utils/subscribe.js';

/**
 * Common base of multiplexer origins. It handles all event routing logic.
 * @internal This is an internal api, it might change at any time.
 *
 * @param getOrigin Callback used when accessing to a precise origin.
 */
export function _multiplexer<M extends Mapping>(getOrigin: (key: string) => unknown): Multiplexer<M> {
  return {
    emit(key: string, event: unknown) {
      const [part, rest] = splitKey(key);
      const origin = getOrigin(part);

      if (rest && isEmitter(origin)) {
        return origin.emit(rest, event);
      }

      if (!rest && isMinimalObserver(origin)) {
        return origin.next(event);
      }

      throw new Error(`Unsupported emit key ${key}`);
    },
    on(key: string, ...args: [Partial<Observer>] | SubscribeCallbacks): Unsubscribable {
      const [part, rest] = splitKey(key);
      const origin = getOrigin(part);

      if (rest && isListenable(origin)) {
        return origin.on(rest, parseSubscribeArgs(args));
      }

      if (!rest && isSubscribable(origin)) {
        return origin.subscribe(parseSubscribeArgs(args));
      }

      throw new Error(`Unsupported listen key ${key}`);
    }
  };
}
