/**
 * Object receiving data from an observable
 */
export interface Observer<in D> {
  /**
   * Called with each emitted value
   */
  next(value: D): void;

  /**
   * Called when an error occurs in the observable
   * @param err
   */
  error(err: Error): void;

  /**
   * Called when the observable completes. No other data or error will then be received.
   */
  complete(): void;
}