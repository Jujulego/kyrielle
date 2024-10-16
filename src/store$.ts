import { observable$ } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import type { Deferrable } from './types/inputs/Deferrable.js';
import type { Mutable } from './types/inputs/Mutable.js';
import type { AnySubscribable, Subscribable, SubscribableValue } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';
import type { Ref } from './types/outputs/Ref.js';
import type { Awaitable } from './types/utils.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * Stores origin's emitted data into given reference, to making it deferrable.
 *
 * @since 2.0.0
 */
export function store$<O extends StoreOrigin, R extends StoreRef<SubscribableValue<O>>>(ref: R): PipeStep<O, StoreResult<O, R>>;

export function store$<D>(reference: StoreRef<D>) {
  return (origin: Subscribable<D>) => {
    return resource$()
      .add(observable$<D>((obs, signal) => {
        boundedSubscription(origin, signal, {
          next(data) {
            reference.mutate(data);
            obs.next(data);
          },
          error: (err) => obs.error(err),
          complete: () => obs.complete(),
        });
      }))
      .add({ defer: reference.defer.bind(reference) })
      .build();
  };
}

// Types
export type StoreOrigin<D = unknown> = AnySubscribable<D>;
export type StoreRef<D = unknown> = Deferrable<Awaitable<D | undefined>> & Mutable<D, Awaitable<D>>;

export type StoreResult<O extends StoreOrigin, R extends StoreRef<SubscribableValue<O>>> = Observable<SubscribableValue<O>>
  & (R extends Deferrable<infer D> ? Ref<D> : unknown)
