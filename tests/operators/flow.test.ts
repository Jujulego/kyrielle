import { vi } from 'vitest';

import { Observable } from '@/src/defs/features/observable.js';
import { flow$ } from '@/src/operators/flow.js';
import { PipeContext } from '@/src/operators/pipe.js';
import { source$ } from '@/src/source.js';

describe('flow$', () => {
  it('should pass down result from op to receiver at the end', () => {
    const ref = source$<string>();
    const op = vi.fn((base: Observable<string>, { off }: PipeContext) => {
      const res = source$<number>();
      off.add(base.subscribe((v) => res.next(parseInt(v))));

      return res;
    });
    const rcv = source$();
    vi.spyOn(rcv, 'next');

    // Setup flow
    const off = flow$(ref, op, rcv);

    expect(op).toHaveBeenCalledWith(ref, { off });

    // Emit some data
    ref.next('42');

    expect(rcv.next).toHaveBeenCalledWith(42);
  });
});
