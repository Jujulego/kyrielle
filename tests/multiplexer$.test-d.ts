// noinspection JSVoidFunctionReturnValueUsed

import { multiplexer$ } from '@/src/multiplexer$.js';
import { source$ } from '@/src/source$.js';
import type { Observer } from '@/src/types/inputs/Observer.js';
import type { Subscribable } from '@/src/types/inputs/Subscribable.js';
import { assertType, describe, it } from 'vitest';

describe('nested source', () => {
  const mlt = multiplexer$({
    life: source$<42>(),
    next: { next(event: 'toto') {} } as Observer<'toto'>,
    subs: { subscribe(obs: Observer<'toto'>) {} } as Subscribable<'toto'>,
  });

  it('should accept valid life events', () => {
    assertType(mlt.emit('life', 42));
    assertType(mlt.emit('next', 'toto'));

    // @ts-expect-error Cannot emit "subs" event
    assertType(mlt.emit('subs', 'toto'));

    // @ts-expect-error Cannot emit "toto" as "life" event
    assertType(mlt.emit('life', 'toto'));
  });

  it('should provide valid life events', () => {
    assertType(mlt.on('life', (_: 42) => null));
    assertType(mlt.on('subs', (_: 'toto') => null));

    // @ts-expect-error Cannot listen "next" event
    assertType(mlt.on('next', (_: 'toto') => null));

    // @ts-expect-error Cannot listen "toto" as "life" event
    assertType(mlt.on('life', (_: 'toto') => null));
  });
});

describe('nested multiplexer', () => {
  const mlt = multiplexer$({
    mlt: multiplexer$({
      life: source$<42>(),
      toto: source$<'toto'>(),
    }),
  });

  it('should refuse mlt events', () => {
    // @ts-expect-error Cannot emit "mlt" event (is a multiplexer)
    assertType(mlt.emit('mlt', 42));

    // @ts-expect-error Cannot emit "mlt" event (is a multiplexer)
    assertType(mlt.emit('mlt', 'toto'));
  });

  it('should accept valid mlt.life events', () => {
    assertType(mlt.emit('mlt.life', 42));

    // @ts-expect-error Cannot emit "toto" as "mlt.life" event
    assertType(mlt.emit('mlt.life', 'toto'));
  });

  it('should not provide mlt events', () => {
    // @ts-expect-error Cannot listen "mlt" event (is a multiplexer)
    assertType(mlt.on('mlt', (_: 42 | 'toto') => null));
  });

  it('should provide valid mlt.life events', () => {
    assertType(mlt.on('mlt.life', (_: 42) => null));

    // @ts-expect-error Cannot listen "toto" as "mlt.life" event
    assertType(mlt.on('mlt.life', (_: 'toto') => null));
  });
});
