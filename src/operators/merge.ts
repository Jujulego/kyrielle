import { Listener, Observable, OffFn } from '../defs/index.js';
import { off$ } from '../subscriptions/index.js';

/**
 * Builds observable union of observed values of All
 */
export type MergeObservable<All extends Observable[]> = Observable<MergeObservedValue<All>>;

/**
 * Builds union of observed values of All
 */
export type MergeObservedValue<All extends Observable[]> = All extends [Observable<infer D>]
  ? D
  : All extends [Observable<infer D>, ...infer R extends Observable[]]
    ? D | MergeObservedValue<R>
    : never;

export type MergeArgs = [Observable, Observable, ...Observable[]];

/**
 * Merges 2 or more observables into one, emitting each events incoming from every given sources.
 */
export function merge$<O extends MergeArgs>(...observables: O): MergeObservable<O>;

export function merge$(...observables: Observable[]): Observable {
  return {
    subscribe(listener: Listener): OffFn {
      const off = off$();

      for (const src of observables) {
        off.add(src.subscribe(listener));
      }

      return off;
    },
    unsubscribe(listener: Listener): void {
      for (const src of observables) {
        src.unsubscribe(listener);
      }
    },
    clear() {
      for (const src of observables) {
        src.clear();
      }
    }
  };
}
