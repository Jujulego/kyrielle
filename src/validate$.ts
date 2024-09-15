import { AssertionFn, PredicateFn } from './defs/utils.js';
import { map$, MapOrigin, MapOriginValue, MapResult } from './map$.js';
import { PipeStep } from './pipe$.js';

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

/**
 * Uses given assertion to validate emitted values.
 */
export function validate$<O extends MapOrigin, R extends MapOriginValue<O>>(assert: AssertionFn<MapOriginValue<O>, R>): PipeStep<O, MapResult<O, R>>;

/**
 * Uses given predicate to validate emitted values.
 * Use `onMiss` to customize default error, when predicated returns false.
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
