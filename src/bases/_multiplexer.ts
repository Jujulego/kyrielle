import type { Observer } from '../types/inputs/Observer.js';
import type { Subscribable } from '../types/inputs/Subscribable.js';
import type { AssertMapping, Mapping, MappingKey, PrependMapping } from '../types/mapping.js';
import type { SubscribeArgs } from '../types/outputs/Observable.js';
import type { StrictEmitter } from '../types/outputs/StrictEmitter.js';
import type { StrictListenable } from '../types/outputs/StrictListenable.js';
import type { Subscription } from '../types/outputs/Subscription.js';
import type { MapValueIntersection } from '../types/utils.js';
import { splitKey } from '../utils/key.js';
import { isEmitter, isListenable, isMinimalObserver, isSubscribable } from '../utils/predicates.js';
import { parseSubscribeArgs } from '../utils/subscribe.js';
import { wrapUnsubscribable } from '../utils/subscription.js';

/**
 * Common base of multiplexer origins. It handles all event routing logic.
 * @internal This is an internal api, it might change at any time.
 *
 * @param getOrigin Callback used when accessing to a precise origin.
 */
export function _multiplexer<M extends Mapping>(getOrigin: (key: string) => unknown) {
  return {
    emit: (key: string, event: unknown) => {
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
    on: (key: string, ...args: SubscribeArgs): Subscription => {
      const [part, rest] = splitKey(key);
      const origin = getOrigin(part);

      if (rest && isListenable(origin)) {
        return origin.on(rest, parseSubscribeArgs(args));
      }

      if (!rest && isSubscribable(origin)) {
        return wrapUnsubscribable(origin.subscribe(parseSubscribeArgs(args)));
      }

      throw new Error(`Unsupported listen key ${key}`);
    }
  } as Multiplexer<M>;
}

/**
 * Object managing multiple events
 */
export interface Multiplexer<M extends Mapping = Mapping>
  extends StrictEmitter<InputMapping<M>>, StrictListenable<OutputMapping<M>> {}

/**
 * Builds a mapping from input values of each sources in the given source mapping
 */
type InputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _InputRecord<K, M[K]>;
}>>;

type _InputRecord<K extends string, O> =
  | (O extends StrictEmitter<infer EM> ? PrependMapping<K, EM> : never)
  | (O extends Observer<infer D> ? Record<K, D> : never);

/**
 * Builds a mapping from output values of each sources in the given source mapping
 */
type OutputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _OutputRecord<K, M[K]>;
}>>;

type _OutputRecord<K extends string, O> =
  | (O extends StrictListenable<infer LM> ? PrependMapping<K, LM> : never)
  | (O extends Subscribable<infer D> ? Record<K, D> : never);
