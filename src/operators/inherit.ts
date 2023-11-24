import {
  AnyOrigin,
  Receiver,
  Multiplexer,
  Observable,
  Listener,
  OriginMap,
  DataMap,
  Listenable, KeyEmitter, DataKey, OutputDataMap, InputDataMap
} from '../defs/index.js';
import { multiplexer$ } from '../events/index.js';
import { splitKey } from '../utils/key.js';

/**
 * Add not overridden props of parent map to child map
 */
export type InheritEventMap<PM extends DataMap, M extends DataMap> = M & Pick<PM, Exclude<DataKey<PM>, DataKey<M>>>;

/**
 * Inherits events from PS (Parent Source) and adds events from T
 */
export type Inherit<PO extends AnyOrigin, T extends OriginMap> =
  & (PO extends Receiver<infer D> ? Receiver<D> : unknown)
  & (PO extends Observable<infer D> ? Observable<D> : unknown)
  & (Listenable<PO extends Listenable<infer PLM> ? InheritEventMap<PLM, OutputDataMap<T>> : OutputDataMap<T>>)
  & (KeyEmitter<PO extends KeyEmitter<infer PEM> ? InheritEventMap<PEM, InputDataMap<T>> : InputDataMap<T>>);

/**
 * Creates a new multiplexer inheriting events from parent.
 *
 * @param parent
 * @param map
 */
export function inherit$<O extends AnyOrigin, const T extends OriginMap>(parent: O, map: T): Inherit<O, T>;

export function inherit$(parent: AnyOrigin, map: OriginMap): AnyOrigin {
  const child = multiplexer$(map);

  function targetOf(key: string): Multiplexer<DataMap, DataMap> {
    const [part] = splitKey(key);
    return (part in map ? child : parent) as Multiplexer<DataMap, DataMap>;
  }

  return {
    emit(key: string, data: unknown) {
      const target = targetOf(key);
      return target.emit(key, data);
    },
    next(data: unknown) {
      return (parent as Receiver).next(data);
    },
    subscribe(listener: Listener) {
      return (parent as Observable).subscribe(listener);
    },
    unsubscribe(listener: Listener) {
      return (parent as Observable).unsubscribe(listener);
    },
    on(key: string, listener: Listener) {
      const target = targetOf(key);
      return target.on(key, listener);
    },
    off(key: string, listener: Listener) {
      const target = targetOf(key);
      return target.off(key, listener);
    },
    clear(key?: string) {
      if (!key) {
        child.clear();

        if ('clear' in parent) {
          parent.clear();
        }
      } else {
        const target = targetOf(key);
        return target.clear(key);
      }
    }
  };
}
