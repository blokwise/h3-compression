import type { Buffer } from 'node:buffer'
import type { CompressCallback } from 'node:zlib'
import type { BufferCreator, DecodingOptions, EncodingMethod, EncodingOptions } from '../types'
import { decodingOptions, encodingOptions } from './options'
import { zlib } from './zlib'

/**
 * Convert a callback-based handler to an `Promise`-based one.
 *
 * @param handler Handler to convert.
 *
 * @since 0.5.0
 */
export function toAsyncBufferCreator<
  O extends EncodingOptions<any> | DecodingOptions<any>,
>(
  handler: BufferCreator<O>,
) {
  return async (
    input: Buffer<ArrayBuffer>,
    opts: O = {} as O,
  ): Promise<Buffer<ArrayBufferLike>> => await new Promise((
    resolve,
    reject,
  ) => {
    // define callback
    const cb = (
      error: Error | null,
      output: Buffer,
    ) =>
      error
        ? reject(error)
        : resolve(output)

    handler(input, opts, cb)
  })
}

/**
 * Use encoding/decoding handler based on the encoding method.
 *
 * @param method Encoding method.
 * @param options Options to configure handler encoding/decoding options with.
 * @param options.contentType Content type of the data to be processed. This only affects encoding options for 'br'. If omitted, `br` encoding options are set to generic mode.
 * @param options.size Size of the unencoded data. This affects encoding options for 'br'. A hint to the unencoded size will be included in the encoded data to improve decoding.
 *
 * @since 0.5.0
 */
export function useBufferCreator<
  M extends EncodingMethod,
  E extends EncodingOptions<M>,
  D extends DecodingOptions<M>,
>(
  method: M,
  options: {
    contentType?: string | number | string[] | undefined
    size?: number
  } = {},
) {
  /**
   * Encoding handler.
   *
   * @param data Data to encode.
   * @param opts Encoding options.
   * @param cb Callback function to use.
   */
  const encode: BufferCreator<E> = (
    data: Buffer<ArrayBuffer>,
    opts: E,
    cb: CompressCallback,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    return zlib.encode[method](data, encodingOptions(method, { ...options, [method]: opts }), cb)
  }

  /**
   * Decoding handler.
   *
   * @param data Data to decode.
   * @param opts Decoding options.
   * @param cb Callback function to use.
   */
  const decode: BufferCreator<D> = (
    data: Buffer<ArrayBuffer>,
    opts: D,
    cb: CompressCallback,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    return zlib.decode[method](data, decodingOptions(method, { ...options, [method]: opts }), cb)
  }

  return {
    encode,
    decode,
  }
}
