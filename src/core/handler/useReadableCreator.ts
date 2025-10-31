import type { DecodingOptions, EncodingMethod, EncodingOptions, ReadableCreator } from '../types'
import { Buffer } from 'node:buffer'
import { PassThrough, Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { upperFirst } from 'scule'
import { decodingOptions, encodingOptions } from './options'
import { zlib } from './zlib'

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
    ).then(() => {
      // eslint-disable-next-line no-console
      console.log('encoding done')
    }).catch((err) => {
      proxy.destroy(err)
    })

    return proxy
  }
}

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
