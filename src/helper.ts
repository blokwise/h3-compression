import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import type { BrotliCompressMode, CompressOptions, EncodingMethod, RenderResponse, StreamEncodingMethod } from './types'
import { promisify } from 'node:util'
import { isObject, isString } from '@antfu/utils'
import { getRequestHeader, getResponseHeader, setResponseHeader } from 'h3'
import { EncodingMethods } from './enums'
import { zlib } from './zlib'

/**
 * Minimum of 1024 bytes are recommend to enable compression as smaller inputs might generate outputs which exceed input sizes.
 */
const MINIMUM_COMPRESSION_INPUT_SIZE = 1024

/**
 * Returns the most suitable encoding method based on the request's `Accept-Encoding` header.
 *
 * @param event H3 event object.
 * @param allowedMethods List of allowed encoding methods to consider. Defaults to all supported methods (`zstd`, `br`, `gzip`, `deflate`).
 *
 * @returns The most suitable (allowed) encoding method (`zstd`, `br`, `gzip`, `deflate`) or `undefined` if none are supported.
 *
 * @since 0.4.0
 */
export function detectMostSuitableEncodingMethod<M extends EncodingMethod>(
  event: H3Event,
  allowedMethods: M[] = Object.values(EncodingMethods) as M[],
): M | undefined {
  const encoding = getRequestHeader(event, 'accept-encoding')

  // encoding methods in order of preference
  const methods = [
    EncodingMethods.Zstandard,
    EncodingMethods.Brotli,
    EncodingMethods.GZip,
    EncodingMethods.Deflate,
  ].filter(c => allowedMethods.includes(c as M)) as M[]

  for (const method of methods) {
    if (encoding?.includes(method) && zlib.availableMethods.includes(method)) {
      return method
    }
  }

  return undefined
}

/**
 * Get Brotli compression options based on the specified mode.
 *
 * @param mode Brotli compression mode (`fast` or `small`).
 *
 * @since 0.4.0
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

  // return undefined to apply default options
  return undefined
}

/**
 * Check if the request accepts a specific encoding method.
 *
 * @param event H3 event object.
 * @param method Compression method (`gzip`, `deflate`, `br`, `zstd`) to check.
 *
 * @returns `true` if the request accepts the specified encoding method, otherwise `false`.
 *
 * @since 0.4.0
 */
function acceptsEncodingMethod(
  event: H3Event,
  method: EncodingMethod,
) {
  return getRequestHeader(event, 'accept-encoding')?.includes(method)
}

/**
 * Check if a 'Content-Encoding' response header is present.
 *
 * @param event H3 event object.
 *
 * @returns `true` if the response has a 'Content-Encoding' header, otherwise `false`.
 *
 * @since 0.4.0
 */
function hasContentEncoding(
  event: H3Event,
) {
  return !!getResponseHeader(event, 'content-encoding')
}

/**
 * Check if the response body is compressible (`string` or `object-like` structure, such as `JSON`).
 *
 * @param body Response body to check.
 *
 * @returns `true` if the response body is compressible, otherwise `false`.
 *
 * @since 0.4.0
 */
function isCompressableResponseBody<T extends string | object>(
  body: T | unknown,
) {
  return isString(body) || isObject(body)
}

/**
 * Get the size of a response body.
 *
 * @param body Response body to get the size of.
 *
 * @returns Size of the response body or `-1` if size cannot be determined.
 *
 * @since 0.4.0
 */
function getResponseBodySize<T extends string | object>(
  body: T | unknown,
) {
  if (isString(body)) {
    return body.length
  }

  if (isObject(body)) {
    return JSON.stringify(body).length
  }

  return -1
}

/**
 * Get the response body in a compressible format (`string`).
 *
 * @param body Response body to convert.
 *
 * @returns Compressible response body.
 *
 * @since 0.4.0
 */
function getCompressableResponseBody<T extends string | object>(
  body: T | unknown,
) {
  if (isString(body)) {
    return body
  }

  if (isObject(body)) {
    return JSON.stringify(body)
  }

  throw new Error('Response body is not compressable')
}

/**
 * Compress the response using the specified method.
 *
 * @param event H3 event object.
 * @param data Data to compress.
 * @param method Compression method (`gzip`, `deflate`, `br`, `zstd`) to use.
 * @param opts Compression options.
 *
 * @returns Compressed data or original data if compression is not applied.
 *
 * @since 0.4.0
 */
export async function compress<T extends string | object | unknown>(
  event: H3Event,
  data: T,
  method: EncodingMethod,
  opts: CompressOptions = {},
): Promise<T | Buffer> {
  const shouldCompress = acceptsEncodingMethod(event, method)
    // do not compress already compressed response
    // such as e.g. assets already compressed by nitro
    && !hasContentEncoding(event)
    // only compress if response body has compressable format
    && isCompressableResponseBody(data)
    // only compress if response body size exceeds minimum threshold
    && getResponseBodySize(data) > MINIMUM_COMPRESSION_INPUT_SIZE

  if (shouldCompress) {
    // set 'Content-Encoding' header
    setResponseHeader(event, 'Content-Encoding', method)

    // compress the data
    return await (
      method === 'br'
        ? promisify(zlib[method])(getCompressableResponseBody(data), getBrotliCompressOptions(opts.br))
        : promisify(zlib[method])(getCompressableResponseBody(data))
    ) as Buffer
  }

  return data
}

/**
 * Compress the response using CompressionStream API.
 *
 * @param event H3 event object.
 * @param data Data to compress.
 * @param method Compression method (`gzip`, `deflate`) to use.
 *
 * @returns Compressed ReadableStream or original ReadableStream if compression is not applied.
 *
 * @since 0.4.0
 */
export async function compressStream<T extends string | unknown>(
  event: H3Event,
  data: T,
  method: StreamEncodingMethod,
): Promise<ReadableStream> {
  const stream = new Response(data as string).body as ReadableStream
  const shouldCompress = acceptsEncodingMethod(event, method)

  if (shouldCompress) {
    // set 'Content-Encoding' header
    setResponseHeader(event, 'Content-Encoding', method)

    // compress stream
    return stream.pipeThrough(new CompressionStream(method))
  }

  return stream
}

/**
 * Compress the response body using the provided `compressStream()` function.
 *
 * @description
 * Applies compressed body to the response.
 *
 * @param response Response object with body prop.
 * @param compress Compression function to use.
 *
 * @since 0.4.0
 */
export async function compressResponseBody<T extends string | unknown>(
  response: Partial<RenderResponse<T>>,
  compress: (response: Partial<RenderResponse<T>>) => Promise<ReadableStream>,
): Promise<void>

/**
 * Compress the response body using the provided `compress()` function.
 *
 * @description
 * Applies compressed body to the response.
 *
 * @param response Response object with body prop.
 * @param compress Compression function to use.
 *
 * @since 0.4.0
 */
export async function compressResponseBody<T extends string | object | unknown>(
  response: Partial<RenderResponse<T>>,
  compress: (response: Partial<RenderResponse<T>>) => Promise<T | Buffer>,
): Promise<void>

/**
 * Compress response body using the provided compress function.
 *
 * @description
 * Applies compressed body to the response.
 *
 * @since 0.4.0
 */
export async function compressResponseBody<C extends ((...args: any[]) => Promise<any>)>(
  ...args: [response: Partial<RenderResponse>, compress: C]
) {
  const [response, compress] = args

  // compress response body and apply
  response.body = await compress(response)
}
