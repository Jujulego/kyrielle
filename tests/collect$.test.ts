import { collect$ } from '@/src/collect$.js';
import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { describe, expect, it } from 'vitest';

// Tests
describe('collect$', () => {
  it('should collect emitted items into an array', async () => {
    await expect(pipe$(
      of$([1, 2, 3]),
      collect$()
    )).resolves.toEqual([1, 2, 3]);
  });
});