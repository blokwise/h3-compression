import type { H3Event } from 'h3'
import type { CompressOptions, RenderResponse } from './core'
import { compress, compressResponseBody, detectMostSuitableEncodingMethod } from './core'

/**
 * Compresses the response (body) with [zlib.gzip]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 *
 * @since 0.3.0
 */
export async function useGZipCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compressResponseBody(response, response => compress(event, response.body, 'gzip', opts))
}

/**
 * Compresses the response (body) with [zlib.deflate]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 *
 * @since 0.3.0
 */
export async function useDeflateCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compressResponseBody(response, response => compress(event, response.body, 'deflate', opts))
}

/**
 * Compresses the response (body) with [zlib.brotliCompress]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 *
 * @since 0.3.0
 */
export async function useBrotliCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compressResponseBody(response, response => compress(event, response.body, 'br', opts))
}

/**
 * Compresses the response (body) with [zlib.zstdCompress]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 *
 * @since 0.5.0
 */
export async function useZstdCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compressResponseBody(response, response => compress(event, response.body, 'zstd', opts))
}

/**
 * Compresses the response (body) with [Zlib]{@link https://www.w3schools.com/nodejs/ref_zlib.asp} by `Accept-Encoding` header. Best is used first.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 *
 * @since 0.3.0
 */
export async function useCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  const compression = detectMostSuitableEncodingMethod(event, opts.encodingMethods ?? {})

  if (compression) {
    await compressResponseBody(response, response => compress(event, response.body, compression, opts))
  }
}
