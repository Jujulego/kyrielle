import { Mutable, Readable } from './defs/index.js';

/**
 * Origins that can be bounded
 */
export type BindOrigin<D> = Readable<D>
  & Partial<Mutable<D, D>>;

/**
 * Bind decorator type
 */
export type BindDecorator<V> = <T>(target: ClassAccessorDecoratorTarget<T, V>, ctx: ClassAccessorDecoratorContext<T, V>) => ClassAccessorDecoratorResult<T, V>;

/**
 * Binds given origin to class accessor
 */
export function Bind<V, D extends V>(origin: BindOrigin<D>): BindDecorator<V> {
  return (target: ClassAccessorDecoratorTarget<unknown, V>, ctx: ClassAccessorDecoratorContext<unknown, V>) => {
    const result: ClassAccessorDecoratorResult<unknown, V> = {
      get: origin.read,
    };

    if ('mutate' in origin) {
      result.set = origin.mutate;
    } else {
      result.set = () => {
        throw new Error(`Cannot set ${String(ctx.name)}, it is bound to a readonly reference.`);
      };
    }

    return result;
  };
}
