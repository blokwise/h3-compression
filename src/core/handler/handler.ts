import type { Buffer } from 'node:buffer'
import type { CompressCallback } from 'node:zlib'
import type { DecodingHandler, DecodingOptions, EncodingHandler, EncodingMethod, EncodingOptions } from '../types'
import { defu } from 'defu'
import { isTextMime } from '../utils'
import { zlib } from './zlib'

/**
 * Use encoding/decoding handler based on the encoding method.
 *
 * @param method Encoding method.
 * @param opts Options to configure handler encoding/decoding options with.
 * @param opts.contentType Content type of the data to be processed. This only affects encoding options for 'br'. If omitted, `br` encoding options are set to generic mode.
 * @param opts.size Size of the unencoded data. This affects encoding options for 'br'. A hint to the unencoded size will be included in the encoded data to improve decoding.
 *
 * @since 0.5.0
 */
export function useHandler<
  M extends EncodingMethod,
  E extends EncodingOptions<M>,
  D extends DecodingOptions<M>,
>(
  method: M,
  opts: {
    contentType?: string | number | string[] | undefined
    size?: number
  } = {},
) {
  const commonOptions = {
    flush: zlib.constants.Z_SYNC_FLUSH,
    finishFlush: zlib.constants.Z_SYNC_FLUSH,
  }
  const encodingOptions = {
    br: {
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: !!opts.contentType && isTextMime(String(opts.contentType || ''))
          ? zlib.constants.BROTLI_MODE_TEXT
          : zlib.constants.BROTLI_MODE_GENERIC,
        // 4 is generally more appropriate for dynamic content, faster than gzip and better compression ratio
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
        // to configure max compression ratio use corresponding constant
        // [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
        ...(opts.size ? { [zlib.constants.BROTLI_PARAM_SIZE_HINT]: opts.size } : {}),
      },
    },
    gzip: {
      level: zlib.constants.Z_BEST_COMPRESSION,
    },
  }
  const decodingOptions = {}

  const createOptions = <O extends E | D>(...opts: O[]) => {
    return defu({}, ...[...opts, commonOptions])
  }

  /**
   * Encoding handler.
   *
   * @param data Data to encode.
   * @param opts Encoding options.
   * @param cb Callback function to use.
   */
  const encode: EncodingHandler<M> = (data: Buffer<ArrayBuffer>, opts: E, cb: CompressCallback) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    return zlib.encode[method](data, createOptions(opts ?? {}, encodingOptions[method] ?? {}), cb)
  }

  /**
   * Decoding handler.
   *
   * @param data Data to decode.
   * @param opts Decoding options.
   * @param cb Callback function to use.
   */
  const decode: DecodingHandler<M> = (data: Buffer<ArrayBuffer>, opts: D, cb: CompressCallback) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    return zlib.decode[method](data, createOptions(opts ?? {}, decodingOptions[method] ?? {}), cb)
  }

  return {
    encode,
    decode,
  }
}
