import type { Buffer } from 'node:buffer'
import type { CompressCallback } from 'node:zlib'
import type { CompressionHandler, EncodingMethod } from '../types'
import { isTextMime } from '../utils'
import { zlib } from './zlib'

/**
 * Get compression handler based on the encoding method.
 *
 * @param method Encoding method.
 * @param opts Options to configure handler compression options with.
 * @param opts.contentType Content type of the data to be compressed. This affects compression options if encoding is set to 'br'. If omitted, `br` options are set to generic mode.
 * @param opts.size Size of the data to be compressed. This affects compression options if encoding is set to 'br' and are included in the compressed data to hint decompression size.
 *
 * @returns Compression handler function.
 *
 * @since 0.5.0
 */
export function getCompressionHandler(
  method: EncodingMethod,
  opts: {
    contentType?: string | number | string[] | undefined
    size?: number
  } = {},
): CompressionHandler {
  const commonOptions = {
    flush: zlib.constants.Z_SYNC_FLUSH,
    finishFlush: zlib.constants.Z_SYNC_FLUSH,
  }

  const compressionOptions = {
    zstd: {
      ...commonOptions,
    },
    br: {
      ...commonOptions,
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: !!opts.contentType && isTextMime(String(opts.contentType || ''))
          ? zlib.constants.BROTLI_MODE_TEXT
          : zlib.constants.BROTLI_MODE_GENERIC,
        // [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        // 4 is generally more appropriate for dynamic content, faster than gzip and better compression ratio
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
        ...(opts.size ? { [zlib.constants.BROTLI_PARAM_SIZE_HINT]: opts.size } : {}),
      },
    },
    gzip: {
      ...commonOptions,
      level: zlib.constants.Z_BEST_COMPRESSION,
    },
    deflate: {
      ...commonOptions,
    },
  }

  /**
   * Compression handler.
   *
   * @param body Data to compress.
   * @param cb Callback function to use.
   */
  return function handler(body: Buffer<ArrayBuffer>, cb: CompressCallback) {
    // @ts-expect-error this is ok, function overload is not inferred properly
    return zlib[method](body, compressionOptions[method], cb)
  }
}
