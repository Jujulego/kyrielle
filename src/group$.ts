import { _multiplexer, type _Multiplexer } from './bases/_multiplexer.js';
import { merge$ } from './merge$.js';
import type { Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';

/**
 * Builds a multiplexer routing events to origins within the given map, and an observable that emit every
 * value emitted by the given origins.
 *
 * @since 2.3.0
 */
export function group$<M extends GroupMapping>(origins: M): Group<M> {
  return Object.assign(
    merge$(...Object.values(origins)) as GroupObservable<M>,
    _multiplexer<M>((key) => origins[key])
  );
}

// Types
export type GroupMapping = Record<string, Subscribable>;
export type Group<M extends GroupMapping> = _Multiplexer<M> & GroupObservable<M>;

type GroupObservable<M extends GroupMapping> = Observable<GroupValue<M>>;

type GroupValue<M extends GroupMapping> = GroupValueMap<M>[keyof M];

type GroupValueMap<M extends GroupMapping> = {
  [K in keyof M]: SubscribableValue<M[K]>;
};
