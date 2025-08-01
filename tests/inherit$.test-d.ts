// noinspection JSVoidFunctionReturnValueUsed

import { inherit$ } from '@/src/inherit$.js';
import { multiplexer$ } from '@/src/multiplexer$.js';
import { source$ } from '@/src/source$.js';
import { assertType, describe, it } from 'vitest';

describe('base nested source', () => {
  const inh = inherit$(
    multiplexer$({
      a: source$<'a'>(),
    }),
    multiplexer$({
      c: source$<'c'>(),
    })
  );

  it('should accept "a" events', () => {
    assertType(inh.emit('a', 'a'));

    // @ts-expect-error Cannot emit "toto" as "a" event
    assertType(inh.emit('a', 'toto'));
  });

  it('should provide "a" events', () => {
    assertType(inh.on('a', (_: 'a') => null));

    // @ts-expect-error Cannot listen "toto" as "a" event
    assertType(inh.on('a', (_: 'toto') => null));
  });

  it('should accept "c" events', () => {
    assertType(inh.emit('c', 'c'));

    // @ts-expect-error Cannot emit "toto" as "c" event
    assertType(inh.emit('c', 'toto'));
  });

  it('should provide "c" events', () => {
    assertType(inh.on('c', (_: 'c') => null));

    // @ts-expect-error Cannot listen "toto" as "c" event
    assertType(inh.on('c', (_: 'toto') => null));
  });
});

describe('overridden nested source', () => {
  const inh = inherit$(
    multiplexer$({
      b: source$<'b1'>(),
    }),
    multiplexer$({
      b: source$<'b2'>(),
    })
  );

  it('should accept "b2" events', () => {
    assertType(inh.emit('b', 'b2'));

    // @ts-expect-error Cannot emit "b1" as "b" event
    assertType(inh.emit('b', 'b1'));

    // @ts-expect-error Cannot emit "toto" as "b" event
    assertType(inh.emit('b', 'toto'));
  });

  it('should provide "b2" events', () => {
    assertType(inh.on('b', (_: 'b2') => null));

    // @ts-expect-error Cannot listen "b1" as "b" event
    assertType(inh.on('b', (_: 'b1') => null));

    // @ts-expect-error Cannot listen "toto" as "b" event
    assertType(inh.on('b', (_: 'toto') => null));
  });
});

describe('base nested multiplexer', () => {
  const inh = inherit$(
    multiplexer$({
      a: multiplexer$({
        life: source$<42>(),
      }),
    }),
    multiplexer$({
      c: multiplexer$({
        life: source$<42>(),
      }),
    })
  );

  it('should accept valid "a.life" events', () => {
    assertType(inh.emit('a.life', 42));

    // @ts-expect-error Cannot emit "toto" as "a.life" event
    assertType(inh.emit('a.life', 'toto'));
  });

  it('should provide "a.life" events', () => {
    assertType(inh.on('a.life', (_: 42) => null));

    // @ts-expect-error Cannot listen "toto" as "a.life" event
    assertType(inh.on('a.life', (_: 'toto') => null));
  });

  it('should accept valid "c.life" events', () => {
    assertType(inh.emit('c.life', 42));

    // @ts-expect-error Cannot emit "toto" as "c.life" event
    assertType(inh.emit('c.life', 'toto'));
  });

  it('should provide "c.life" events', () => {
    assertType(inh.on('c.life', (_: 42) => null));

    // @ts-expect-error Cannot listen "toto" as "c.life" event
    assertType(inh.on('c.life', (_: 'toto') => null));
  });
});

describe('overridden nested multiplexer', () => {
  const inh = inherit$(
    multiplexer$({
      b: multiplexer$({
        life: source$<1>(),
      }),
    }),
    multiplexer$({
      b: multiplexer$({
        life: source$<42>(),
      }),
    })
  );

  it('should accept valid "b.life" events', () => {
    assertType(inh.emit('b.life', 42));

    // @ts-expect-error Cannot emit "1" as "b.life" event
    assertType(inh.emit('b.life', 1));

    // @ts-expect-error Cannot emit "toto" as "b.life" event
    assertType(inh.emit('b.life', 'toto'));
  });

  it('should provide "b.life" events', () => {
    assertType(inh.on('b.life', (_: 42) => null));

    // @ts-expect-error Cannot listen "b1" as "b.life" event
    assertType(inh.on('b.life', (_: 1) => null));

    // @ts-expect-error Cannot listen "toto" as "b.life" event
    assertType(inh.on('b.life', (_: 'toto') => null));
  });
});
