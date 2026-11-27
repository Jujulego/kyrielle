// noinspection JSVoidFunctionReturnValueUsed

import { group$ } from '@/src/group$.js';
import { source$ } from '@/src/source$.js';
import type { PartialObserver } from '@/src/features/partial-observer.js';
import type { Subscribable } from '@/src/features/subscribable.js';
import { assertType, describe, it } from 'vitest';

describe('nested source', () => {
  const grp = group$({
    life: source$<42>(),
    subs: { subscribe(obs: PartialObserver<'toto'>) {} } as Subscribable<'toto'>,
  });

  it('should accept valid life events', () => {
    assertType(grp.emit('life', 42));

    // @ts-expect-error Cannot emit "subs" event
    assertType(grp.emit('subs', 'toto'));

    // @ts-expect-error Cannot emit "toto" as "life" event
    assertType(grp.emit('life', 'toto'));
  });

  it('should provide valid life events', () => {
    assertType(grp.on('life', (_: 42) => null));
    assertType(grp.on('subs', (_: 'toto') => null));

    // @ts-expect-error Cannot listen "toto" as "life" event
    assertType(grp.on('life', (_: 'toto') => null));
  });

  it('should be observable with sources event type', () => {
    assertType(grp.subscribe((_: 42 | 'toto') => null));
  });
});

describe('nested group', () => {
  const grp = group$({
    grp: group$({
      life: source$<42>(),
      toto: source$<'toto'>(),
    }),
  });

  it('should refuse grp events', () => {
    // @ts-expect-error Cannot emit "grp" event (is a group)
    assertType(grp.emit('grp', 42));

    // @ts-expect-error Cannot emit "mlt" event (is a group)
    assertType(grp.emit('grp', 'toto'));
  });

  it('should accept valid grp.life events', () => {
    assertType(grp.emit('grp.life', 42));

    // @ts-expect-error Cannot emit "toto" as "mlt.life" event
    assertType(grp.emit('grp.life', 'toto'));
  });

  it('should provide grp events', () => {
    assertType(grp.on('grp', (_: 42 | 'toto') => null));
  });

  it('should provide valid grp.life events', () => {
    assertType(grp.on('grp.life', (_: 42) => null));

    // @ts-expect-error Cannot listen "toto" as "grp.life" event
    assertType(grp.on('grp.life', (_: 'toto') => null));
  });

  it('should be observable with nested group event type', () => {
    assertType(grp.subscribe((_: 42 | 'toto') => null));
  });
});
