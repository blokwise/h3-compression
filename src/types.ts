/**
 * Render response interface.
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
 */
export type BrotliCompressMode = 'fast' | 'small'

/**
 * Compression options.
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
