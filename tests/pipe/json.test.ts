import { describe, expect, it, vi } from 'vitest';

import { json$ } from '@/src/pipe/json.js';
import { pipe$ } from '@/src/pipe/pipe.js';
import { const$ } from '@/src/refs/const.js';
import { ref$ } from '@/src/refs/ref.js';
import { var$ } from '@/src/refs/var.js';

// Test
describe('json$', () => {
  it('should call validate on each value emitted by base', () => {
    const base = var$('1');
    const validate = vi.fn((val) => typeof val === 'number') as unknown as (val: unknown) => val is number;
    const spy = vi.fn();

    const ref = pipe$(base, json$(validate));
    ref.subscribe(spy);

    base.mutate('42');
    expect(validate).toHaveBeenCalledWith(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  describe('read', () => {
    it('should call fn with value read from base', () => {
      const base = const$('42');
      const validate = vi.fn((val) => typeof val === 'number') as unknown as (val: unknown) => val is number;

      const ref = pipe$(base, json$(validate));

      expect(ref.read()).toBe(42);
      expect(validate).toHaveBeenCalledWith(42);
    });

    it('should call fn with value resolved from base', async () => {
      const base = ref$({ read: async () => '42' });
      const validate = vi.fn((val) => typeof val === 'number') as unknown as (val: unknown) => val is number;

      const ref = pipe$(base, json$(validate));

      await expect(ref.read()).resolves.toBe(42);
      expect(validate).toHaveBeenCalledWith(42);
    });
  });

  describe('mutate', () => {
    it('should call fn with mutate result from base', () => {
      const base = var$('1');
      const validate = vi.fn((val) => typeof val === 'number') as unknown as (val: unknown) => val is number;

      vi.spyOn(base, 'mutate');

      const ref = pipe$(base, json$(validate));

      expect(ref.mutate(42)).toBe(42);
      expect(validate).toHaveBeenCalledWith(42);
      expect(base.mutate).toHaveBeenCalledWith('42', undefined);
    });

    it('should call fn with mutate resolved result from base', async () => {
      const base = ref$({
        read: () => '42',
        mutate: async (arg: string) => arg,
      });
      const validate = vi.fn((val) => typeof val === 'number') as unknown as (val: unknown) => val is number;

      vi.spyOn(base, 'mutate');

      const ref = pipe$(base, json$(validate));

      await expect(ref.mutate(42)).resolves.toBe(42);
      expect(validate).toHaveBeenCalledWith(42);
      expect(base.mutate).toHaveBeenCalledWith('42', undefined);
    });
  });
});
