import { describe, expect, it, vi } from 'vitest';

import { off$ } from '@/src/off$.js';

// Tests
describe('off$', () => {
  it('should unsubscribe from all registered subscriptions', () => {
    const subA = { unsubscribe: vi.fn() };
    const subB = { unsubscribe: vi.fn() };
    const subC = { unsubscribe: vi.fn() };

    const group = off$(subA, subB);
    group.add(subC);

    group.unsubscribe();

    expect(subA.unsubscribe).toHaveBeenCalled();
    expect(subB.unsubscribe).toHaveBeenCalled();
    expect(subC.unsubscribe).toHaveBeenCalled();
  });
});