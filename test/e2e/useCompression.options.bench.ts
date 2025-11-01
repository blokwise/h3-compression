import type { App } from 'h3'
import type { listen } from 'listhen'
import { bench, describe } from 'vitest'
import { createFetch, createH3App, loadJsonData, requestEncoding } from '../utils'

const DEBUG = false

describe('useCompression options', async () => {
  const json = {
    body: await loadJsonData('geojson.json'),
    size: {
      gzip: 5444622,
      deflate: 5484569,
      br: 3925981,
      zstd: 4768085,
    },
  }
  const data = json

  let listener: Awaited<ReturnType<typeof listen>>
  let baseURL: string
  // eslint-disable-next-line unused-imports/no-unused-vars
  let h3App: App
  let fetch: ReturnType<typeof createFetch>

  bench('compress', async () => {
    await requestEncoding(fetch, 'zstd')
  }, {
    setup: async () => {
      h3App = undefined
      await listener?.close()

      const { useCompression } = await import('@blokwise/h3-compression')
      const server = await createH3App({
        body: data.body,
        handler: useCompression,
        debug: DEBUG,
      })

      h3App = server.app
      listener = server.listener
      baseURL = server.baseURL
      fetch = createFetch({ baseURL, debug: DEBUG })
    },
    teardown: async () => {
      h3App = undefined
      await listener?.close()
    },
    warmupIterations: 2,
    time: 10000,
    iterations: 20,
  })

  bench('compress with opts.chunkedTransferEncoding disabled', async () => {
    await requestEncoding(fetch, 'zstd')
  }, {
    setup: async () => {
      h3App = undefined
      await listener?.close()

      const { useCompression } = await import('@blokwise/h3-compression')
      const server = await createH3App({
        body: data.body,
        handler: useCompression,
        opts: {
          chunkedTransferEncoding: false,
        },
        debug: DEBUG,
      })

      h3App = server.app
      listener = server.listener
      baseURL = server.baseURL
      fetch = createFetch({ baseURL, debug: DEBUG })
    },
    teardown: async () => {
      h3App = undefined
      await listener?.close()
    },
    warmupIterations: 2,
    time: 10000,
    iterations: 20,
  })

  bench('compress with opts.returnReadableStream', async () => {
    await requestEncoding(fetch, 'zstd')
  }, {
    setup: async () => {
      h3App = undefined
      await listener?.close()

      const { useCompression } = await import('@blokwise/h3-compression')
      const server = await createH3App({
        body: data.body,
        handler: useCompression,
        opts: {
          chunkedTransferEncoding: true,
          returnReadableStream: true,
        },
        debug: DEBUG,
      })

      h3App = server.app
      listener = server.listener
      baseURL = server.baseURL
      fetch = createFetch({ baseURL, debug: DEBUG })
    },
    teardown: async () => {
      h3App = undefined
      await listener?.close()
    },
    warmupIterations: 2,
    time: 10000,
    iterations: 20,
  })
})
