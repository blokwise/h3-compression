import type { H3Event } from 'h3'
import type { CompressionHandler } from '../types'
import { Buffer } from 'node:buffer'
import { removeResponseHeader, setResponseHeader } from 'h3'

export function createStreamCompressionHandler(
  handler: CompressionHandler,
) {
  return (event: H3Event) => {
    const res = event.node.res
    const chunks: Buffer[] = []

    // keep source stream methods
    const _end = res.end.bind(res)

    // override write to buffer chunks
    res.write = function (
      chunk: any,
      ..._args: any[]
    ) {
      if (chunk) {
        chunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(chunk),
        )
      }

      // prevent actual write
      return true
    }

    // override end to finalize and send compressed response
    // @ts-expect-error this is ok
    res.end = function (
      chunk: any,
      ...args: any[]
    ) {
      if (chunk) {
        chunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(chunk),
        )
      }

      // create input for the compression handler
      const input = Buffer.concat(chunks)

      // define callback
      const cb = (
        error: Error | null,
        output: Buffer,
      ) => {
        if (error) {
          // uncompressed if error
          setResponseHeader(event, 'Content-Length', input.length)
          removeResponseHeader(event, 'Content-Encoding')

          _end(input, ...args)
          return
        }

        setResponseHeader(event, 'Content-Length', output.length)

        _end(output, ...args)
      }

      handler(input, cb)
    }
  }
}

export function createAsyncCompressionHandler(
  handler: CompressionHandler,
) {
  return async (input: Buffer<ArrayBuffer>): Promise<Buffer<ArrayBufferLike>> => await new Promise((
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

    handler(input, cb)
  })
}
