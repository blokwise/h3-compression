import type { Buffer } from 'node:buffer'
import type { BrotliOptions, ZlibOptions, ZstdOptions } from 'node:zlib'
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
 * Allowed encoding methods.
 *
 * @since 0.5.0
 */
export interface AllowedEncodingMethods {
  /**
   * Whether to enable `deflate` compression.
   *
   * @default true
   */
  deflate?: boolean

  /**
   * Whether to enable `gzip` compression.
   *
   * @default true
   */
  gzip?: boolean

  /**
   * Whether to enable `br` compression.
   *
   * @default true
   */
  br?: boolean

  /**
   * Whether to enable `zstd` compression (if supported by runtime).
   *
   * @default true
   */
  zstd?: boolean
}

/**
 * Encoding options type.
 *
 * @template M Encoding method.
 *
 * @since 0.5.3
 */
export type EncodingOptions<
  M extends EncodingMethod,
> = M extends typeof EncodingMethods.Zstandard
  ? ZstdOptions
  : M extends typeof EncodingMethods.Brotli
    ? BrotliOptions
    : ZlibOptions

/**
 * Decoding options type.
 *
 * @template M Encoding method.
 *
 * @since 0.5.3
 */
export type DecodingOptions<
  M extends EncodingMethod,
> = M extends typeof EncodingMethods.Zstandard
  ? ZstdOptions
  : M extends typeof EncodingMethods.Brotli
    ? BrotliOptions
    : ZlibOptions

/**
 * Compression options.
 *
 * @since 0.4.0
 */
export interface CompressOptions {
  /**
   * Minimum size in bytes to apply compression on.
   *
   * @default 1024
   */
  threshold?: number

  /**
   * Allowed encoding methods.
   *
   * @since 0.5.0
   */
  encodingMethods?: AllowedEncodingMethods
}

/**
 * Handler type.
 *
 * @param O Options type.
 *
 * @since 0.5.0
 */
export type Handler<
  O extends EncodingOptions<any> | DecodingOptions<any>,
> = ((
  input: Buffer<ArrayBuffer>,
  opts: O,
  cb: (error: Error | null, output: Buffer) => void,
) => void)

/**
 * Encoding handler type.
 *
 * @param M Encoding method.
 *
 * @since 0.5.3
 */
export type EncodingHandler<
  M extends EncodingMethod,
> = Handler<EncodingOptions<M>>

/**
 * Decoding handler type.
 *
 * @param M Encoding method.
 *
 * @since 0.5.3
 */
export type DecodingHandler<
  M extends EncodingMethod,
> = Handler<DecodingOptions<M>>
