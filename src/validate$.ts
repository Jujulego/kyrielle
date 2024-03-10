import { AssertionFn, PredicateFn } from './defs/utils.js';
import { each$, EachOrigin, EachOriginValue } from './each$.js';
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
export function validate$<O extends EachOrigin, R extends EachOriginValue<O>>(assert: AssertionFn<EachOriginValue<O>, R>): PipeStep<O, R>;

/**
 * Uses given predicate to validate emitted values.
 * Use `onMiss` to customize default error, when predicated returns false.
 */
export function validate$<O extends EachOrigin, R extends EachOriginValue<O>>(predicate: PredicateFn<EachOriginValue<O>, R>, opts?: ValidatePredicateOpts<EachOriginValue<O>>): PipeStep<O, R>;

export function validate$(fn: (data: unknown) => boolean | void, opts: ValidatePredicateOpts = {}) {
  return each$((data) => {
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
