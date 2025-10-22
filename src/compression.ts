import type { H3Event } from 'h3'
import type { CompressOptions, RenderResponse } from './types'
import { compress, getSuitableCompression } from './helper'

/**
 * Compresses the response with [zlib.gzip]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 */
export async function useGZipCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compress(event, response, 'gzip', opts)
}

/**
 * Compresses the response with [zlib.deflate]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 */
export async function useDeflateCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compress(event, response, 'deflate', opts)
}

/**
 * Compresses the response with [zlib.brotliCompress]{@link https://www.w3schools.com/nodejs/ref_zlib.asp}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 */
export async function useBrotliCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  await compress(event, response, 'br', opts)
}

/**
 * Compresses the response with [Zlib]{@link https://www.w3schools.com/nodejs/ref_zlib.asp} by 'Accept-Encoding' header. Best is used first.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 * @param opts Compression options.
 */
export async function useCompression(
  event: H3Event,
  response: Partial<RenderResponse>,
  opts: CompressOptions = {},
): Promise<void> {
  const compression = getSuitableCompression(event)

  if (compression) {
    await compress(event, response, compression, opts)
  }
}
