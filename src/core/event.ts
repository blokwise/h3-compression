import type { H3Event } from 'h3'
import type { Buffer } from 'node:buffer'
import type { AllowedEncodingMethods, CompressOptions, EncodingMethod, RenderResponse, StreamEncodingMethod } from './types'
import { getRequestHeader, getResponseHeader, setResponseHeader } from 'h3'
import { EncodingMethods } from './enums'
import { toAsyncBufferCreator, useBufferCreator } from './handler'
import { zlib } from './handler/zlib'
import { getCompressible, getSize, isCompressibleFormat } from './utils'

/**
 * Minimum of 1024 bytes are recommend to enable compression as smaller inputs might generate outputs which exceed input sizes.
 */
const MINIMUM_COMPRESSION_INPUT_SIZE = 1024

/**
 * Get enabled encoding methods based on the provided options.
 *
 * @param methods Allowed encoding methods.
 *
 * @since 0.5.0
 */
export function getEncodingMethodsOptions(
  methods: AllowedEncodingMethods = {},
) {
  return {
    [EncodingMethods.Deflate]: true,
    [EncodingMethods.GZip]: true,
    [EncodingMethods.Brotli]: true,
    [EncodingMethods.Zstandard]: true,
    ...methods,
  }
}

/**
 * Returns the most suitable encoding method based on the request's `Accept-Encoding` header.
 *
 * @param event H3 event object.
 * @param options Options to configure encoding methods. By default all methods (`zstd`, `br`, `gzip`, `deflate`) are enabled.
 *
 * @returns The most suitable (allowed) encoding method (`zstd`, `br`, `gzip`, `deflate`) or `undefined` if none are supported.
 *
 * @since 0.4.0
 */
export function detectMostSuitableEncodingMethod(
  event: H3Event,
  options: AllowedEncodingMethods = getEncodingMethodsOptions(),
): EncodingMethod | undefined {
  const encoding = getRequestHeader(event, 'accept-encoding')

  // encoding methods in order of preference
  const methods = [
    EncodingMethods.Zstandard,
    EncodingMethods.Brotli,
    EncodingMethods.GZip,
    EncodingMethods.Deflate,
  ].filter(method => getEncodingMethodsOptions(options)[method])

  for (const method of methods) {
    if (encoding?.includes(method) && zlib.availableMethods.includes(method)) {
      return method
    }
  }

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
  if (!getEncodingMethodsOptions(opts.encodingMethods)[method]) {
    return data
  }

  const shouldCompress = acceptsEncodingMethod(event, method)
    // do not compress already compressed response
    // such as e.g. assets already compressed by nitro
    && !hasContentEncoding(event)
    // only compress if response body has compressible format
    && isCompressibleFormat(data)
    // only compress if response body size exceeds minimum threshold
    && getSize(data) > (opts.threshold ?? MINIMUM_COMPRESSION_INPUT_SIZE)

  if (shouldCompress) {
    // set 'Content-Encoding' header
    setResponseHeader(event, 'Content-Encoding', method)
    setResponseHeader(event, 'Vary', 'Accept-Encoding')

    // compress the data
    const handler = toAsyncBufferCreator(useBufferCreator(method, {
      contentType: getResponseHeader(event, 'content-type'),
      size: getSize(data),
    }).encode)

    return await handler(getCompressible(data))
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
    setResponseHeader(event, 'Vary', 'Accept-Encoding')

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
