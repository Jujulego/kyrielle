import { DataKey, DataListener, EmittedDataMap, Group, ListenedDataMap, OriginMap } from '../defs/index.js';
import { off$ } from '../subs/off.js';
import { multiplexer$ } from './multiplexer.js';

/**
 * Group object with mapped origins
 */
export interface GroupObj<M extends OriginMap> extends Group<EmittedDataMap<M>, ListenedDataMap<M>> {
  /**
   * Mapped origins
   */
  readonly origins: ReadonlyMap<DataKey<M>, M[DataKey<M>]>;
}

export type GroupListener<M extends OriginMap> = DataListener<ListenedDataMap<M>>;

/**
 * Builds a group routing events to origins within the given map, and emitting any "child" event
 * @param map
 */
export function group$<M extends OriginMap>(map: M): GroupObj<M> {
  const mlt = multiplexer$(map);

  return Object.assign(mlt, {
    subscribe(listener: GroupListener<M>) {
      const off = off$();

      for (const key of mlt.eventKeys()) {
        off.add(mlt.on(key, listener));
      }

      return off;
    },

    unsubscribe(listener: GroupListener<M>) {
      for (const key of mlt.eventKeys()) {
        mlt.off(key, listener);
      }
    }
  });
}
