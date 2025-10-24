import type { H3Event } from 'h3'
import type { RenderResponse, StreamEncodingMethod } from './types'
import { StreamEncodingMethods } from './enums'
import { compressResponseBody, compressStream, detectMostSuitableEncodingMethod } from './helper'

/**
 * Compresses the response (body) with [CompressionStream(gzip)]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream}.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 *
 * @since 0.3.0
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
 *
 * @since 0.3.0
 */
export async function useDeflateCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  await compressResponseBody(response, response => compressStream(event, response.body, 'deflate'))
}

/**
 * Compresses the response (body) with [CompressionStream]{@link https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream} by `Accept-Encoding` header. Best is used first.
 *
 * @param event H3 event object.
 * @param response Response object with body prop.
 *
 * @since 0.3.0
 */
export async function useCompressionStream(
  event: H3Event,
  response: Partial<RenderResponse>,
) {
  const method = detectMostSuitableEncodingMethod(event, Object.values(StreamEncodingMethods) as StreamEncodingMethod[])

  if (method) {
    await compressResponseBody(response, response => compressStream(event, response.body, method))
  }
}
