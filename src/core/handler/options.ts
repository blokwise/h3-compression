import type { EncodingMethod, EncodingOptions } from '../types'
import { defu } from 'defu'
import { isTextMime } from '../utils'
import { zlib } from './zlib'

/**
 * Common options used for encoding **and** decoding.
 */
const COMMON_OPTIONS = {
  flush: zlib.constants.Z_SYNC_FLUSH,
  finishFlush: zlib.constants.Z_SYNC_FLUSH,
}

function createOptions<O>(...opts: O[]) {
  return defu({}, ...[...opts, COMMON_OPTIONS])
}

export function encodingOptions<
  M extends EncodingMethod,
  E extends EncodingOptions<M>,
>(
  method: M,
  opts: {
    [K in M]?: E
  } & {
    contentType?: string | number | string[] | undefined
    size?: number
  } = {},
) {
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

  return createOptions(opts[method] ?? {}, (encodingOptions as Record<M, any>)[method] ?? {})
}

export function decodingOptions<
  M extends EncodingMethod,
  E extends EncodingOptions<M>,
>(
  method: M,
  opts: {
    [K in M]?: E
  },
) {
  const decodingOptions = {}

  return createOptions(opts[method] ?? {}, (decodingOptions as Record<M, any>)[method] ?? {})
}
