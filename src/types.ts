import type { EncodingMethods, StreamEncodingMethods } from './enums'

/**
 * Encoding method type.
 *
 * @since 0.5.0
 */
export type EncodingMethod = typeof EncodingMethods[keyof typeof EncodingMethods]

/**
 * Encoding method type for `CompressionStream` API.
 *
 * @since 0.5.0
 */
export type StreamEncodingMethod = typeof StreamEncodingMethods[keyof typeof StreamEncodingMethods]

/**
 * Render response interface.
 *
 * @since 0.4.0
 */
export interface RenderResponse<
  T extends string | object | unknown = string | object | unknown,
> {
  body: T
  statusCode: number
  statusMessage: string
  headers: Record<string, string>
}

/**
 * Brotli compression mode.
 *
 * @since 0.4.0
 */
export type BrotliCompressMode = 'fast' | 'small'

/**
 * Compression options.
 *
 * @since 0.4.0
 */
export interface CompressOptions {
  /**
   * Brotli compression mode.
   *
   * `'fast'` is most suitable for dynamic content whereas `'small'` results in a slightly better compression ratio (`9.08` vs `7.39`) but is `~90` times slower (`1240ms` vs `14ms`).
   *
   * @default 'fast'
   */
  br?: BrotliCompressMode
}
