/* eslint-disable @typescript-eslint/no-unused-vars */
import { assertType } from 'vitest';

//import { group$ } from '@/src/group.js';
import { multiplexer$ } from '@/src/multiplexer.js';
import { source$ } from '@/src/source.js';

describe('nested source', () => {
  const mlt = multiplexer$({
    life: source$<42>(),
    toto: source$<'toto'>(),
  });

  it('should accept valid life events', () => {
    assertType(mlt.emit('life', 42));

    // @ts-expect-error Cannot emit "toto" as "life" event
    assertType(mlt.emit('life', 'toto'));
  });

  it('should provide valid life events', () => {
    assertType(mlt.on('life', (_: 42) => null));

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

// describe('nested group', () => {
//   const mlt = multiplexer$({
//     grp: group$({
//       life: source$<42>(),
//       toto: source$<'toto'>(),
//     }),
//   });
//
//   it('should refuse grp events', () => {
//     // @ts-expect-error Cannot emit "grp" event (is a group)
//     assertType(mlt.emit('grp', 42));
//
//     // @ts-expect-error Cannot emit "grp" event (is a group)
//     assertType(mlt.emit('grp', 'toto'));
//   });
//
//   it('should accept valid grp.life events', () => {
//     assertType(mlt.emit('grp.life', 42));
//
//     // @ts-expect-error Cannot emit "toto" as "grp.life" event
//     assertType(mlt.emit('grp.life', 'toto'));
//   });
//
//   it('should provide grp events', () => {
//     assertType(mlt.on('grp', (_: 42 | 'toto') => null));
//   });
//
//   it('should provide valid grp.life events', () => {
//     assertType(mlt.on('grp.life', (_: 42) => null));
//
//     // @ts-expect-error Cannot listen "toto" as "grp.life" event
//     assertType(mlt.on('grp.life', (_: 'toto') => null));
//   });
// });
