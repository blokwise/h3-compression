import type { H3Event } from 'h3'
import type { RenderResponse } from './types'
import { compressResponseBody, compressStream, getMostSuitableCompression } from './helper'

/**
 * Compresses the response (body) with [CompressionStream(gzip)]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useGZipCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  await compressResponseBody(response, response => compressStream(event, response.body, 'gzip'))
}

/**
 * Compresses the response (body) with [CompressionStream(deflate)]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useDeflateCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  await compressResponseBody(response, response => compressStream(event, response.body, 'deflate'))
}

/**
 * Compresses the response (body) with [CompressionStream]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream} by 'Accept-Encoding' header. Best is used first.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 */
export async function useCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  const compression = getMostSuitableCompression(event)

  if (compression && compression !== 'br') {
    await compressResponseBody(response, response => compressStream(event, response.body, compression))
  }
}
