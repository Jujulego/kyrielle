import type { MapOrigin, MapOriginValue, MapResult } from './map$.js';
import { map$ } from './map$.js';
import type { PipeStep } from './pipe$.js';

/**
 * Applies given function on every emitted values, including values returned by defer and mutate if present.
 *
 * @since 2.2.0
 */
export function tap$<O extends MapOrigin>(fn: (arg: MapOriginValue<O>) => void): PipeStep<O, MapResult<O, MapOriginValue<O>>> {
  return map$((item) => {
    fn(item);
    return item;
  });
}
