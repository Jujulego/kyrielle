import { map$, type MapOrigin, type MapOriginValue, type MapResult } from './map$.js';
import type { PipeStep } from './pipe$.js';
import type { AssertionFn, PredicateFn } from './types/utils.js';

/**
 * Uses given assertion to validate emitted values.
 *
 * @since 1.0.0
 */
export function validate$<O extends MapOrigin, R extends MapOriginValue<O>>(assert: AssertionFn<MapOriginValue<O>, R>): PipeStep<O, MapResult<O, R>>;

/**
 * Uses given predicate to validate emitted values.
 * Use `onMiss` to customize default error, when predicated returns false.
 *
 * @since 1.0.0
 */
export function validate$<O extends MapOrigin, R extends MapOriginValue<O>>(predicate: PredicateFn<MapOriginValue<O>, R>, opts?: ValidatePredicateOpts<MapOriginValue<O>>): PipeStep<O, MapResult<O, R>>;

export function validate$(fn: (data: unknown) => boolean | void, opts: ValidatePredicateOpts = {}) {
  return map$((data) => {
    if (fn(data) === false) {
      if (opts.onMiss) {
        opts.onMiss(data);
      } else {
        throw new ValidateError(data);
      }
    }

    return data;
  });
}

// Types
export interface ValidatePredicateOpts<in D = unknown> {
  /**
   * Called when predicate returns false. Should throw a meaningful error.
   */
  readonly onMiss?: (data: D) => never;
}

/**
 * Error thrown by validate$ on predicate miss.
 */
export class ValidateError<D = unknown> extends Error {
  constructor(readonly data: D) {
    super('Validation error');
  }
}
