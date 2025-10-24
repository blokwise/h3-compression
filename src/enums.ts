/**
 * Encoding method enum.
 *
 * @since 0.5.0
 */
export const EncodingMethods = {
  Brotli: 'br',
  GZip: 'gzip',
  Deflate: 'deflate',
  Zstandard: 'zstd',
} as const

/**
 * Encoding method enum for `CompressionStream` API.
 *
 * @since 0.5.0
 */
export const StreamEncodingMethods = {
  GZip: EncodingMethods.GZip,
  Deflate: EncodingMethods.Deflate,
} as const
