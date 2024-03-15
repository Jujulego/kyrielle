import { Readable } from './defs/index.js';
import { readable$ } from './readable$.js';

export interface FetchOpts<D = Response> extends Omit<RequestInit, 'signal'> {
  onFetch?: (url: string | URL) => void;
  onSuccess?: (res: Response) => D;
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

export function fetch$<D>(url: string | URL, opts: FetchOpts & { onSuccess(res: Response): D }): Readable<Promise<D>>;
export function fetch$(url: string | URL, opts?: FetchOpts): Readable<Promise<Response>>;

export function fetch$<D = Response>(url: string | URL, opts: FetchOpts<D> = {}): Readable<Promise<D>> {
  return readable$(async (signal): Promise<D> => {
    if (opts.onFetch) opts.onFetch(url);
    const res = await fetch(url, { ...opts, signal });

    if (!res.ok) {
      throw new FetchError(res);
    }

    return opts.onSuccess ? opts.onSuccess(res) : <D>res;
  });
}
