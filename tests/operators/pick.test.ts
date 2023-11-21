import { vi } from 'vitest';

import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { pick$ } from '@/src/operators/pick.js';
import { source$, SourceObj } from '@/src/source.js';

// Setup
let mlt: MultiplexerObj<{ 'life': SourceObj<number> }>;

beforeEach(() => {
  mlt = multiplexer$({
    life: source$<number>()
  });
});

// Tests
describe('pick$', () => {
  it('should pass emit to multiplexer', () => {
    vi.spyOn(mlt, 'emit');

    const src = pick$(mlt, 'life');
    src.next(42);

    expect(mlt.emit).toHaveBeenCalledWith('life', 42);
  });

  it('should pass subscription to multiplexer', () => {
    vi.spyOn(mlt, 'on');
    const fn = vi.fn();

    const src = pick$(mlt, 'life');
    src.subscribe(fn);

    expect(mlt.on).toHaveBeenCalledWith('life', fn);
  });

  it('should pass unsubscription to multiplexer', () => {
    vi.spyOn(mlt, 'off');
    const fn = vi.fn();

    const src = pick$(mlt, 'life');
    src.unsubscribe(fn);

    expect(mlt.off).toHaveBeenCalledWith('life', fn);
  });

  it('should pass clear call to multiplexer', () => {
    vi.spyOn(mlt, 'clear');

    const src = pick$(mlt, 'life');
    src.clear();

    expect(mlt.clear).toHaveBeenCalledWith('life');
  });
});
