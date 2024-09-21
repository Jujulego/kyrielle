import type { Deferrable, Mutable, Observable, Observer, Subscription } from './defs/index.js';
import { parseSubscribeArgs, type SubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

export interface Var<in out D> extends Observable<D>, Deferrable<D>, Mutable<D, D> {}
export interface UninitializedVar<in out D> extends Observable<D>, Deferrable<D | undefined>, Mutable<D, D> {}

/**
 * Builds an uninitialized var
 */
export function var$<D>(): UninitializedVar<D>;

/**
 * Builds an initialized var
 * @param initial
 */
export function var$<D>(initial: D): Var<D>;

export function var$<D>(initial?: D): UninitializedVar<D> {
  const observers = new Set<Observer<D>>();
  let value = initial;

  const _var = {
    defer: () => value,
    mutate: (arg: D) => {
      value = arg;

      if (value !== undefined) {
        for (const observer of observers) {
          observer.next(value);
        }
      }

      return value;
    },
    [Symbol.observable ?? '@@observable']: () => _var,
    subscribe(...args: SubscribeArgs<D>): Subscription {
      const observer = parseSubscribeArgs(args);
      const subscription = buildSubscription({
        onUnsubscribe: () => observers.delete(observer),
        isClosed: () => !observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);

      if (value !== undefined) {
        observer.next(value);
      }

      return subscription;
    },
  };

  return _var;
}
