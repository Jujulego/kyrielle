import { Deferrable } from './defs/index.js';
import { deferrable$ } from './deferrable$.js';

export interface FetchOpts<D = Response> extends Omit<RequestInit, 'signal'> {
  onFetch?: (url: string | URL) => void;
  onSuccess?: (res: Response) => PromiseLike<D>;
}

export class FetchError extends Error {
  // Constructor
  constructor(readonly response: Response) {
    super(response.statusText);
  }

  // Properties
  get status(): number {
    return this.response.status;
  }
}

export function fetch$<D>(url: string | URL, opts: FetchOpts & { onSuccess(res: Response): PromiseLike<D> }): Deferrable<Promise<D>>;
export function fetch$(url: string | URL, opts?: FetchOpts): Deferrable<Promise<Response>>;

export function fetch$<D = Response>(url: string | URL, opts: FetchOpts<D> = {}): Deferrable<Promise<D>> {
  return deferrable$(async (signal): Promise<D> => {
    if (opts.onFetch) opts.onFetch(url);
    const res = await fetch(url, { ...opts, signal });

    if (!res.ok) {
      throw new FetchError(res);
    }

    return opts.onSuccess ? opts.onSuccess(res) : res as D;
  });
}
