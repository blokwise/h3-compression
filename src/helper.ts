import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import type { BrotliCompressMode, CompressOptions, RenderResponse } from './types'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { getRequestHeader, getResponseHeader, setResponseHeader } from 'h3'

/**
 * Minimum of 1024 bytes are recommend to enable compression as smaller inputs might generate outputs which exceed input sizes.
 */
const MINIMUM_COMPRESSION_INPUT_SIZE = 1024

/**
 * Returns the most suitable compression method based on the request's `Accept-Encoding` header.
 *
 * @param event H3 event object.
 *
 * @returns The most suitable compression method ('br', 'gzip', 'deflate') or `undefined` if none are supported.
 */
export function getSuitableCompression(
  event: H3Event,
) {
  const encoding = getRequestHeader(event, 'accept-encoding')

  if (encoding?.includes('br')) {
    return 'br'
  }

  if (encoding?.includes('gzip')) {
    return 'gzip'
  }

  if (encoding?.includes('deflate')) {
    return 'deflate'
  }

  return undefined
}

/**
 * Get Brotli compression options based on the specified mode.
 *
 * @param mode Brotli compression mode ('fast' or 'small').
 */
function getBrotliCompressOptions(
  mode: BrotliCompressMode = 'fast',
) {
  if (mode === 'fast') {
    return {
      params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        // 4 is generally more appropriate for dynamic content, faster than gzip and better compression ratio
        [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
      },
    }
  }

  // use default options
  return undefined
}

/**
 * Compress the response using the specified method.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param method Compression method ('gzip', 'deflate', 'br') to use.
 * @param opts Compression options.
 */
export async function compress(
  event: H3Event,
  response: Partial<RenderResponse>,
  method: 'gzip' | 'deflate' | 'br',
  opts: CompressOptions = {},
) {
  const acceptsEncoding = getRequestHeader(event, 'accept-encoding')?.includes(method)
  const contentEncoding = getResponseHeader(event, 'content-encoding')
  const shouldCompress = typeof response.body === 'string'
    // do not compress already compressed response
    // such as e.g. assets already compressed by nitro
    && !contentEncoding
    && response.body.length >= MINIMUM_COMPRESSION_INPUT_SIZE
    && acceptsEncoding

  if (shouldCompress) {
    setResponseHeader(event, 'Content-Encoding', method)

    response.body = await (
      method === 'br'
        ? promisify(zlib.brotliCompress)(response.body as string, getBrotliCompressOptions(opts.br))
        : promisify(zlib[method])(response.body as string)
    ) as Buffer
  }
}

/**
 * Compress the response using CompressionStream API.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param method Compression method ('gzip', 'deflate') to use.
 */
export async function compressStream(
  event: H3Event,
  response: Partial<RenderResponse>,
  method: 'gzip' | 'deflate',
) {
  const stream = new Response(response.body as string).body as ReadableStream
  const acceptsEncoding = getRequestHeader(event, 'accept-encoding')?.includes(method)

  if (acceptsEncoding) {
    setResponseHeader(event, 'Content-Encoding', method)
    response.body = stream.pipeThrough(new CompressionStream(method))
  }
  else {
    response.body = stream
  }
}
