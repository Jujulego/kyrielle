import { describe, expect, it, vi } from 'vitest';

import { registry$ } from '@/src/collections/registry.js';
import { source$ } from '@/src/events/source.js';

// Tests
describe('registry$', () => {
  it('should use builder to create a reference', () => {
    const builder = vi.fn(() => source$<number>());
    const registry = registry$(builder);
    registry.ref('life');

    expect(builder).toHaveBeenCalledWith('life');
  });

  it('should not use builder on a lazy call', () => {
    const builder = vi.fn(() => source$<number>());
    const registry = registry$(builder);
    registry.ref('life', true);

    expect(builder).not.toHaveBeenCalled();
  });

  it('should return the same reference for the same key', () => {
    const builder = vi.fn(() => source$<number>());
    const registry = registry$(builder);

    expect(registry.ref('life')).toBe(registry.ref('life'));
    expect(builder).toHaveBeenCalledOnce();
  });

  it('should emit when a ref changes', () => {
    const registry = registry$(() => source$<number>());
    const ref = registry.ref('life');

    const spy = vi.fn();
    registry.on('life', spy);

    ref.next(42);

    expect(spy).toHaveBeenCalledWith(42);
  });
});