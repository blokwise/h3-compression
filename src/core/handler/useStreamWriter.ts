import type { CompressCallback } from 'node:zlib'
import type { DecodingOptions, EncodingMethod, EncodingOptions, StreamWriter } from '../types'
import { Buffer } from 'node:buffer'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { upperFirst } from 'scule'
import { decodingOptions, encodingOptions } from './options'
import { zlib } from './zlib'

/**
 * Convert a callback-based handler to a `Readable`-based one.
 *
 * @param handler Handler to convert.
 *
 * @since 0.5.0
 */
export function toAsyncStreamWriter<
  O extends EncodingOptions<any> | DecodingOptions<any>,
>(
  handler: StreamWriter<O>,
) {
  return async <T extends NodeJS.WritableStream>(
    destination: T,
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

    handler(input, destination, opts, cb)
  })
}

export function useStreamWriter<
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
   * @param destination Destination stream to write to.
   * @param opts Encoding options.
   * @param cb Callback function to use.
   */
  const encode: StreamWriter<E> = <T extends NodeJS.WritableStream>(
    data: Buffer<ArrayBuffer>,
    destination: T,
    opts: E,
    cb: CompressCallback,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    const handler = zlib.encode[`create${upperFirst(method)}`](encodingOptions(method, { ...options, [method]: opts }))

    // Normalize input to Buffer
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as any)

    try {
      // stream the buffer through the compressor into the destination and await completion
      pipeline(
        Readable.from([buffer]),
        handler,
        destination as NodeJS.WritableStream,
      ).then(() => {
        // eslint-disable-next-line no-console
        console.log('encoding done')
        cb(null, Buffer.alloc(0)) // signal completion
      })
    }
    catch (err) {
      // On error, fallback to sending the uncompressed data directly
      // ensure destination receives whole body and is properly ended
      try {
        destination.write(buffer)
        cb(null, Buffer.alloc(0)) // signal completion
      }
      finally {
        // some destinations expect end to be called; call it if available
        if (typeof (destination as any).end === 'function') {
          (destination as any).end()
        }
      }
      // rethrow so callers can observe the failure if needed
      // throw err
      cb(err as Error, Buffer.alloc(0))
    }
  }

  /**
   * Decoding handler.
   *
   * @param data Data to decode.
   * @param destination Destination stream to write to.
   * @param opts Decoding options.
   * @param cb Callback function to use.
   */
  const decode: StreamWriter<D> = <T extends NodeJS.WritableStream>(
    data: Buffer<ArrayBuffer>,
    destination: T,
    opts: D,
    cb: CompressCallback,
  ) => {
    // @ts-expect-error this is ok, function overload is not inferred properly
    const handler = zlib.decode[`create${upperFirst(method)}`](decodingOptions(method, { ...options, [method]: opts }))

    // Normalize input to Buffer
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data as any)

    try {
      // stream the buffer through the compressor into the destination and await completion
      pipeline(
        Readable.from([buffer]),
        handler,
        destination as NodeJS.WritableStream,
      ).then(() => {
        // eslint-disable-next-line no-console
        console.log('decoding done')
        cb(null, Buffer.alloc(0)) // signal completion
      })
    }
    catch (err) {
      // On error, fallback to sending the uncompressed data directly
      // ensure destination receives whole body and is properly ended
      try {
        destination.write(buffer)
        cb(null, Buffer.alloc(0)) // signal completion
      }
      finally {
        // some destinations expect end to be called; call it if available
        if (typeof (destination as any).end === 'function') {
          (destination as any).end()
        }
      }
      // rethrow so callers can observe the failure if needed
      // throw err
      cb(err as Error, Buffer.alloc(0))
    }
  }

  return {
    encode,
    decode,
  }
}
