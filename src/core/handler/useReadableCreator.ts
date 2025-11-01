import type { DecodingOptions, EncodingMethod, EncodingOptions, ReadableCreator } from '../types'
import { Buffer } from 'node:buffer'
import { PassThrough, Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { upperFirst } from 'scule'
import { decodingOptions, encodingOptions } from './options'
import { zlib } from './zlib'

/**
 * Create a stream transform pipe.
 *
 * @param transform Transformer to apply.
 *
 * @since 0.6.0
 */
function createTransform(
  transform: NodeJS.ReadWriteStream,
) {
  return (data: Buffer<ArrayBuffer>) => {
    // normalize input to buffer
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as any)

    // create passthrough proxy
    const proxy = new PassThrough()

    // pipe the data
    pipeline(
      Readable.from([buffer]),
      transform,
      proxy,
    ).catch((err) => {
      proxy.destroy(err)
    })

    return proxy
  }
}

/**
 * Use encoding/decoding handler which return the processed data as a readable stream.
 *
 * @param method Encoding method.
 * @param options Options to configure handler encoding/decoding options with.
 * @param options.contentType Content type of the data to be processed. This only affects encoding options for 'br'. If omitted, `br` encoding options are set to generic mode.
 * @param options.size Size of the unencoded data. This affects encoding options for 'br'. A hint to the unencoded size will be included in the encoded data to improve decoding.
 *
 * @since 0.6.0
 */
export function useReadableCreator<
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
   */
  const encode: ReadableCreator<E> = (
    data: Buffer<ArrayBuffer>,
    opts: E,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    const handler = zlib.encode[`create${upperFirst(method)}`](encodingOptions(method, { ...options, [method]: opts }))

    const pipe = createTransform(handler)

    return pipe(data)
  }

  /**
   * Decoding handler.
   *
   * @param data Data to decode.
   * @param opts Decoding options.
   */
  const decode: ReadableCreator<D> = (
    data: Buffer<ArrayBuffer>,
    opts: D,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    const handler = zlib.decode[`create${upperFirst(method)}`](decodingOptions(method, { ...options, [method]: opts }))

    const pipe = createTransform(handler)

    return pipe(data)
  }

  return {
    encode,
    decode,
  }
}
