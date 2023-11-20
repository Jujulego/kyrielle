import {
  DataKey,
  DataMap,
  EmittedDataMap,
  Key,
  ListenedDataMap,
  Listener,
  Multiplexer,
  OffFn,
  OriginMap,
  Source
} from '../../defs/index.js';
import { splitKey } from '../../utils/key.js';

type NextCb<R> = (src: Multiplexer<DataMap, DataMap>, key: Key) => R;
type EndCb<R> = (src: Source) => R;

export type MapOfOrigins<M extends OriginMap> = Map<DataKey<M>, M[DataKey<M>]>;
export type GetOriginFn<M extends OriginMap> = <K extends DataKey<M>>(key: K) => M[K];

/**
 * Common base of multiplexer origins. It handles all event routing logic.
 * @internal This is an internal api, it might change at any time.
 *
 * @param origins Map object storing origins
 * @param getOrigin Callback used when accessing to a precise origin.
 */
export function _multiplexer$<const M extends OriginMap>(origins: MapOfOrigins<M>, getOrigin: GetOriginFn<M>): Multiplexer<EmittedDataMap<M>, ListenedDataMap<M>> {
  function routeEvent<R>(key: Key, next: NextCb<R>, end: EndCb<R>): R {
    const [part, subkey] = splitKey(key);
    const src = getOrigin(part);

    if (subkey) {
      return next(src as Multiplexer<DataMap, DataMap>, subkey);
    } else {
      return end(src as Source);
    }
  }

  return {
    emit(key: Key, data: unknown) {
      routeEvent(key,
        (mlt, subkey) => mlt.emit(subkey, data),
        (src) => src.next(data),
      );
    },

    *eventKeys() {
      for (const [key, src] of origins.entries()) {
        if ('subscribe' in src) {
          yield key as DataKey<ListenedDataMap<M>>;
        }

        if ('eventKeys' in src) {
          for (const childKey of src.eventKeys()) {
            yield `${key}.${childKey}`;
          }
        }
      }
    },

    on<const K extends DataKey<ListenedDataMap<M>>>(key: K, listener: Listener<ListenedDataMap<M>[K]>): OffFn {
      return routeEvent(key,
        (mlt, subkey) => mlt.on(subkey, listener as Listener),
        (src) => src.subscribe(listener as Listener),
      );
    },

    off<const K extends DataKey<ListenedDataMap<M>>>(key: K, listener: Listener<ListenedDataMap<M>[K]>): void {
      routeEvent(key,
        (mlt, subkey) => mlt.off(subkey, listener as Listener),
        (src) => src.unsubscribe(listener as Listener),
      );
    },

    clear(key?: Key): void {
      if (!key) {
        for (const src of origins.values()) {
          if ('clear' in src) src.clear();
        }
      } else {
        const [part, subkey] = splitKey(key);
        const src = getOrigin(part);

        if ('clear' in src) src.clear(subkey);
      }
    }
  };
}
