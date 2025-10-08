import { filter$, type FilterOrigin, type FilterOriginValue, type FilterResult } from './filter$.js';
import type { PipeStep } from './pipe$.js';

/**
 * Filters emitted values to keep only ones equals to given value.
 *
 * @since 2.7.0
 */
export function is$<O extends FilterOrigin, const R extends FilterOriginValue<O>>(value: R): PipeStep<O, FilterResult<O, R>> {
  return filter$((v): v is R => v === value);
}