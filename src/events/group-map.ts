import {
  AnyOrigin, DataListener,
  DataValue,
  InputDataRecord,
  Group,
  OutputDataRecord,
  Listener
} from '../defs/index.js';
import { source$ } from '../source.js';
import { multiplexerMap$ } from './multiplexer-map.js';

/**
 * Group map with mapped origins and registered listeners
 */
export interface GroupMap<K extends string, O extends AnyOrigin> extends Group<InputDataRecord<K, O>, OutputDataRecord<K, O>> {
  /**
   * Mapped origins
   */
  readonly origins: ReadonlyMap<K, O>;

  /**
   * Registered group listeners
   */
  readonly listeners: ReadonlySet<DataListener<OutputDataRecord<K, O>>>;
}

// Utils
function subscribeToAll(target: AnyOrigin, cb: Listener) {
  if ('subscribe' in target) {
    target.subscribe(cb);
  }

  if ('eventKeys' in target) {
    for (const key of target.eventKeys()) {
      target.on(key, cb);
    }
  }
}

/**
 * Group map, routing events to origins within the given map, and emitting any "child" event.
 * It will create origins when needed using builder
 *
 * @param builder
 */
export function groupMap$<K extends string, O extends AnyOrigin>(builder: (key: K) => O): GroupMap<K, O> {
  const src = source$<DataValue<OutputDataRecord<K, O>>>();

  const mlt = multiplexerMap$((key: K) => {
    const child = builder(key);
    subscribeToAll(child, src.next as Listener);

    return child;
  });

  return {
    eventKeys: mlt.eventKeys,
    emit: mlt.emit,
    on: mlt.on,
    off: mlt.off,

    subscribe: src.subscribe,
    unsubscribe: src.unsubscribe,

    clear(key?: string) {
      mlt.clear(key);

      if (!key) {
        src.clear();

        // Keep listener for grouped events
        subscribeToAll(mlt, src.next as Listener);
      } else {
        // Keep listener for grouped events
        mlt.on(key, src.next);
      }
    },

    get origins() {
      return mlt.origins;
    },
    get listeners() {
      return src.listeners;
    },
  };
}
