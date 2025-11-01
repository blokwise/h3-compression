import { createApp, eventHandler, setResponseHeader, toNodeListener } from 'h3'
import { listen } from 'listhen'

export async function createH3App<T>(config: {
  body: T
  handler: typeof import('@blokwise/h3-compression').useCompression | typeof import('@blokwise/h3-compression').useCompressionStream
  opts?: {
    chunkedTransferEncoding?: boolean
    returnReadableStream?: boolean
  }
}) {
  const app = createApp({
    debug: true,
  })

  app.use('/uncompressed', eventHandler({
    handler: () => {
      return 'not compressed'
    },
  }))
  app.use('/compressed', eventHandler({
    handler: () => {
      // eslint-disable-next-line no-console
      console.log('received request')
      return config.body
    },
    onBeforeResponse: async (event, response) => {
      setResponseHeader(event, 'content-type', 'application/json;charset=utf-8')

      await config.handler(event, response, {
        chunkedTransferEncoding: config.opts?.chunkedTransferEncoding,
        returnReadableStream: config.opts?.returnReadableStream,
      })
      // eslint-disable-next-line no-console
      console.log('encoding done')
    },
  }))

  const listener = await listen(toNodeListener(app))

  return {
    app,
    listener,
    baseURL: listener.url,
  }
}
