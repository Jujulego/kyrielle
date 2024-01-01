import { vi } from 'vitest';

import { Listener } from '@/src/defs/common.js';
import { merge$ } from '@/src/operators/merge.js';
import { source$ } from '@/src/events/source.js';

// Tests
describe('merge$', () => {
  it('should subscribe to each sources', () => {
    const int = source$<number>();
    vi.spyOn(int, 'subscribe');

    const str = source$<string>();
    vi.spyOn(str, 'subscribe');

    const listener: Listener<number | string> = vi.fn();
    const src = merge$(int, str);
    src.subscribe(listener);

    expect(int.subscribe).toHaveBeenCalledWith(listener);
    expect(str.subscribe).toHaveBeenCalledWith(listener);
  });

  it('should unsubscribe from each sources', () => {
    const int = source$<number>();
    vi.spyOn(int, 'unsubscribe');

    const str = source$<string>();
    vi.spyOn(str, 'unsubscribe');

    const listener: Listener<number | string> = vi.fn();
    const src = merge$(int, str);
    src.unsubscribe(listener);

    expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    expect(str.unsubscribe).toHaveBeenCalledWith(listener);
  });

  it('should clear each sources', () => {
    const int = source$<number>();
    vi.spyOn(int, 'clear');

    const str = source$<string>();
    vi.spyOn(str, 'clear');

    const src = merge$(int, str);
    src.clear();

    expect(int.clear).toHaveBeenCalledWith();
    expect(str.clear).toHaveBeenCalledWith();
  });
});
