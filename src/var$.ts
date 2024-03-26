import { Mutable, Observable, Observer, Readable, SubscribeCallbacks, Subscription } from './defs/index.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

export interface Var<in out D> extends Observable<Exclude<D, undefined>>, Readable<D>, Mutable<D> {}

/**
 * Builds an uninitialized var
 */
export function var$<D>(): Var<D | undefined>;

/**
 * Builds an initialized var
 * @param initial
 */
export function var$<D>(initial: D): Var<D>;

export function var$<D>(initial?: D): Var<D | undefined> {
  const observers = new Set<Observer<Exclude<D, undefined>>>();
  let value = initial;

  const _var = {
    read: () => value,
    mutate: (arg: D | undefined) => {
      value = arg;

      if (value !== undefined) {
        for (const observer of observers) {
          observer.next(value as Exclude<D, undefined>);
        }
      }

      return value;
    },
    [Symbol.observable ?? '@@observable']: () => _var,
    subscribe(...args: [Partial<Observer<Exclude<D, undefined>>>] | SubscribeCallbacks<Exclude<D, undefined>>): Subscription {
      const observer = parseSubscribeArgs(args);
      const subscription = buildSubscription({
        onUnsubscribe: () => observers.delete(observer),
        isClosed: () => !observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);

      if (value !== undefined) {
        observer.next(value as Exclude<D, undefined>);
      }

      return subscription;
    },
  };

  return _var;
}