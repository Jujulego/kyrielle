import { describe, expect, it, vi } from 'vitest';

import { Observable } from '@/src/defs/features/observable.js';
import { pipe$, PipeContext } from '@/src/pipe/pipe.js';
import { source$ } from '@/src/source.js';

describe('pipe$', () => {
  it('should use op to prepare result', () => {
    const ref = source$<string>();
    const op = vi.fn((base: Observable<string>, { off }: PipeContext) => {
      const res = source$<number>();
      off.add(base.subscribe((v) => res.next(parseInt(v))));

      return res;
    });
    const spy = vi.fn();

    // Setup pipe
    const result = pipe$(ref, op);

    expect(op).toHaveBeenCalledWith(ref, { off: result.off });

    // Emit some data
    result.subscribe(spy);
    ref.next('42');

    expect(spy).toHaveBeenCalledWith(42);
  });
});
