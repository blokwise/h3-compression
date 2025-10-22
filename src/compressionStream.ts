import type { H3Event } from 'h3'
import type { RenderResponse } from './types'
import { compressStream, getSuitableCompression } from './helper'

/**
 * Compresses the response with [CompressionStream(gzip)]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useGZipCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  await compressStream(event, response, 'gzip')
}

/**
 * Compresses the response with [CompressionStream(deflate)]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useDeflateCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  await compressStream(event, response, 'deflate')
}

/**
 * Compresses the response with [CompressionStream]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream} by 'Accept-Encoding' header. Best is used first.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  const compression = getSuitableCompression(event)

  if (compression && compression !== 'br') {
    await compressStream(event, response, compression)
  }
}
