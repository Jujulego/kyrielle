import { it } from 'vitest';

import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { source$, SourceObj } from '@/src/source.js';
import { iterate$ } from '@/src/subscriptions/iterate.js';
import { off$ } from '@/src/subscriptions/off.js';

// Setup
let src: SourceObj<number>;
let mlt: MultiplexerObj<{ src: SourceObj<number> }>;

beforeEach(() => {
  src = source$();
  mlt = multiplexer$({ src });
});

describe('iterate$', () => {
  describe('on an observable', () => {
    it('should iterate over observable emits', async () => {
      const it = iterate$(src);

      setTimeout(() => src.next(1), 0);
      await expect(it.next()).resolves.toEqual({ value: 1 });

      setTimeout(() => src.next(2), 0);
      await expect(it.next()).resolves.toEqual({ value: 2 });
    });

    it('should abort using controller (source)', async () => {
      const off = off$();
      const it = iterate$(src, { off });

      setTimeout(() => off(), 0);
      await expect(it.next()).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });

  describe('on a listenable', () => {
    it('should iterate over multiplexer emits', async () => {
      const it = iterate$(mlt, 'src');

      setTimeout(() => mlt.emit('src', 1), 0);
      await expect(it.next()).resolves.toEqual({ value: 1 });

      setTimeout(() => mlt.emit('src', 2), 0);
      await expect(it.next()).resolves.toEqual({ value: 2 });
    });

    it('should abort using controller (multiplexer)', async () => {
      const off = off$();
      const it = iterate$(mlt, 'src', { off });

      setTimeout(() => off(), 0);
      await expect(it.next()).rejects.toEqual(new Error('Unsubscribed !'));
    });
  });
});
