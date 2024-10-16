import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { source$ } from './source$.js';
import type { Deferrable } from './types/inputs/Deferrable.js';
import type { Mutable } from './types/inputs/Mutable.js';
import type { Mutator } from './types/outputs/Mutator.js';
import type { Observable } from './types/outputs/Observable.js';
import type { Ref } from './types/outputs/Ref.js';
import { isDeferrable, isMutable, isPromise } from './utils/predicates.js';

/**
 * Adds an observable feature to a resource. The added observable will emit each result from defer & mutate.
 *
 * @since 1.0.0
 */
export function yield$<O extends YieldOrigin>(): PipeStep<O, YieldResult<O>> {
  return (origin: YieldOrigin) => {
    const builder = resource$();
    const source = source$();

    // Utils
    function emitResult(result: unknown) {
      if (isPromise(result)) {
        void result.then((value) => source.next(value));
      } else {
        source.next(result);
      }
    }

    // Add defer
    if (isDeferrable(origin)) {
      builder.add({
        defer: (signal) => {
          const result = origin.defer(signal);
          emitResult(result);

          return result;
        }
      });
    }

    // Add mutable
    if (isMutable(origin)) {
      builder.add({
        mutate: (arg, signal) => {
          const result = origin.mutate(arg, signal);
          emitResult(result);

          return result;
        }
      });
    }

    // Add observable
    builder.add({
      [Symbol.observable ?? '@@observable']: source[Symbol.observable ?? '@@observable'],
      subscribe: source.subscribe,
    });

    return builder.build() as YieldResult<O>;
  };
}

// Types
export type YieldOrigin<D = unknown> = Deferrable<D> | Mutable<D>;
export type YieldOriginValue<O extends YieldOrigin> =
  & (O extends Deferrable<infer D> ? Awaited<D> : unknown)
  & (O extends Mutable<any, infer D> ? Awaited<D> : unknown); // eslint-disable-line @typescript-eslint/no-explicit-any

export type YieldResult<O extends YieldOrigin> =
  & (O extends Deferrable<infer D> ? Ref<D> : unknown)
  & (O extends Mutable<infer A, infer D> ? Mutator<A, D> : unknown)
  & Observable<YieldOriginValue<O>>;
