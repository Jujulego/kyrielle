import { Observable, ObservedValue, Readable, ReadValue } from './features/index.js';

/**
 * Origins that can be piped
 */
export interface PipeOrigin<out D = unknown> extends Partial<Observable<D> & Readable<D>> {}

/**
 * Extract piped value type
 */
export type PipedValue<O extends PipeOrigin> =
  O extends Observable
    ? ObservedValue<O>
    : O extends Readable
      ? ReadValue<O>
      : never;

/**
 * Step in pipe processing
 */
export type PipeStep<A extends PipeOrigin, B> = (origin: A) => B;