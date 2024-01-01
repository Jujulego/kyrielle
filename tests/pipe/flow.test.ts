import { vi } from 'vitest';

import { Observable } from '@/src/defs/features/observable.js';
import { flow$ } from '@/src/pipe/flow.js';
import { source$ } from '@/src/events/source.js';

describe('flow$', () => {
  it('should pass down result from op to receiver at the end', () => {
    const ref = source$<string>();
    const op = vi.fn((base: Observable<string>) => {
      const res = source$<number>();
      base.subscribe((v) => res.next(parseInt(v)));

      return res;
    });
    const rcv = source$();
    vi.spyOn(rcv, 'next');

    // Setup flow
    flow$(ref, op, rcv);

    expect(op).toHaveBeenCalledWith(ref);

    // Emit some data
    ref.next('42');

    expect(rcv.next).toHaveBeenCalledWith(42);
  });
});
