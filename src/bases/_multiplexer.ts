import { Multiplexer, Source } from '../concepts/index.js';
import {
  EmitEventMap,
  EventData,
  EventKey,
  EventMap,
  Key,
  KeyPart,
  Listener,
  ListenEventMap, OffFn,
  SourceMap
} from '../types/index.js';
import { splitKey } from '../utils/key.js';

type NextCb<R> = (src: Multiplexer<EventMap, EventMap>, key: Key) => R;
type EndCb<R> = (src: Source) => R;

export type MapOfSources<M extends SourceMap> = Map<keyof M & KeyPart, M[keyof M & KeyPart]>;
export type GetSourceFn<M extends SourceMap> = <K extends keyof M & KeyPart>(key: K) => M[K];

/**
 * Common base of multiplexer sources. It handles all event routing logic.
 * @internal This is an internal api, it might change at any time.
 *
 * @param sources Map object storing sources
 * @param getSource Callback used when accessing to a precise source.
 */
export function _multiplexer$<const M extends SourceMap>(sources: MapOfSources<M>, getSource: GetSourceFn<M>): Multiplexer<EmitEventMap<M>, ListenEventMap<M>> {
  function routeEvent<R>(key: Key, next: NextCb<R>, end: EndCb<R>): R {
    const [part, subkey] = splitKey(key);
    const src = getSource(part);

    if (subkey) {
      return next(src as Multiplexer<EventMap, EventMap>, subkey);
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
      for (const [key, src] of sources.entries()) {
        if ('subscribe' in src) {
          yield key as EventKey<ListenEventMap<M>>;
        }

        if ('eventKeys' in src) {
          for (const childKey of src.eventKeys()) {
            yield `${key}.${childKey}`;
          }
        }
      }
    },

    on<const K extends EventKey<ListenEventMap<M>>>(key: K, listener: Listener<EventData<ListenEventMap<M>, K>>): OffFn {
      return routeEvent(key,
        (mlt, subkey) => mlt.on(subkey, listener as Listener<unknown>),
        (src) => src.subscribe(listener as Listener<unknown>),
      );
    },

    off<const K extends EventKey<ListenEventMap<M>>>(key: K, listener: Listener<EventData<ListenEventMap<M>, K>>): void {
      routeEvent(key,
        (mlt, subkey) => mlt.off(subkey, listener as Listener),
        (src) => src.unsubscribe(listener as Listener),
      );
    },

    clear(key?: Key): void {
      if (!key) {
        for (const src of sources.values()) {
          if ('clear' in src) src.clear();
        }
      } else {
        const [part, subkey] = splitKey(key);
        const src = getSource(part);

        if ('clear' in src) src.clear(subkey);
      }
    }
  };
}
