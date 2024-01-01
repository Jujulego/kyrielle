import { describe, expect, it, vi } from 'vitest';

import { Listener } from '@/src/defs/common.js';
import { source$, SourceObj } from '@/src/events/source.js';

// Setup
let src: SourceObj<number>;

beforeEach(() => {
  src = source$();
});

// Tests
describe('source$', () => {
  it('should call listeners when an event is emitted', () => {
    const listener: Listener<number> = vi.fn();

    src.subscribe(listener);
    src.next(1);

    expect(listener).toHaveBeenCalledWith(1);
  });

  it('should not call removed listeners (off method)', () => {
    const listener: Listener<number> = vi.fn();

    src.subscribe(listener);
    src.unsubscribe(listener);
    src.next(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', () => {
    const listener: Listener<number> = vi.fn();

    const off = src.subscribe(listener);
    off();

    src.next(1);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (clear)', () => {
    const listener: Listener<number> = vi.fn();

    src.subscribe(listener);
    src.clear();

    src.next(1);

    expect(listener).not.toHaveBeenCalled();
  });
});
