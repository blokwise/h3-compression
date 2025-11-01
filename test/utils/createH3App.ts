import { createApp, eventHandler, setResponseHeader, toNodeListener } from 'h3'
import { listen } from 'listhen'

export async function createH3App<T>(config: {
  body: T
  chunkedTransferEncoding?: boolean
  returnReadableStream?: boolean
}) {
  const { useCompression } = await import('@blokwise/h3-compression')

  const app = createApp({
    debug: true,
  })

  app.use('/uncompressed', eventHandler({
    handler: () => {
      return 'not compressed'
    },
  }))
  app.use('/compressed', eventHandler({
    onBeforeResponse: async (event, response) => {
      setResponseHeader(event, 'content-type', 'application/json;charset=utf-8')

      await useCompression(event, response, {
        chunkedTransferEncoding: config.chunkedTransferEncoding,
        returnReadableStream: config.returnReadableStream,
      })
    },
    handler: () => {
      // eslint-disable-next-line no-console
      console.log('received request')
      return config.body
    },
  }))

  const listener = await listen(toNodeListener(app), {
    port: 3000,
  })

  return {
    app,
    listener,
    baseURL: listener.url,
  }
}
