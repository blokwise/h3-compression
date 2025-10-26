import type { Buffer } from 'node:buffer'
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
 * Compression handler type.
 *
 * @since 0.5.0
 */
export type CompressionHandler = ((
  input: Buffer<ArrayBuffer>,
  cb: (error: Error | null, output: Buffer) => void,
) => void)
