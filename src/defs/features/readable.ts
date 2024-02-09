/**
 * Object that can be read.
 */
export interface Readable<out D = unknown> {
  /**
   * Access to "pointed" data. Can receive a signal to abort request.
   * @param signal
   */
  read(signal?: AbortSignal): D;
}