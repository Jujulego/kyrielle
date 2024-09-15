import type {
  Mutable,
  Deferrable,
  Refreshable,
} from './defs/index.js';
import {
  map$,
  type MapDeferrable,
  type MapMutable,
  type MapOrigin,
  type MapOriginValue,
  type MapRefreshable,
  type MapResult
} from './map$.js';

/** @deprecated use MapOrigin instead */
export type EachOrigin<D = unknown> = MapOrigin<D>;

/** @deprecated use EachMutable instead */
export type EachMutable<O extends Mutable, A, D> = MapMutable<O, A, D>;
/** @deprecated use EachDeferrable instead */
export type EachDeferrable<O extends Deferrable, D> = MapDeferrable<O, D>;
/** @deprecated use EachRefreshable instead */
export type EachRefreshable<O extends Refreshable, D> = MapRefreshable<O, D>;

/** @deprecated use EachOriginValue instead */
export type EachOriginValue<O extends MapOrigin> = MapOriginValue<O>;

/** @deprecated use EachResult instead */
export type EachResult<O, R> = MapResult<O, R>;

/** @deprecated use map$ instead */
export const each$ = map$;
