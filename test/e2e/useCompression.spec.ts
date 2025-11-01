import type { App } from 'h3'
import type { listen } from 'listhen'
import { afterAll, beforeAll, describe, expect, it, suite } from 'vitest'
import { concurrent, createFetch, createH3App, loadJsonData, requestEncoding } from '../utils'

const DEBUG = false

suite('useCompression', async () => {
  const json = {
    body: await loadJsonData('geojson-small.json'),
    size: {
      gzip: 7615,
      deflate: 7636,
      br: 7511,
      zstd: 7685,
    },
  }
  const data = json

  describe('compress', () => {
    let listener: Awaited<ReturnType<typeof listen>>
    let baseURL: string
    // eslint-disable-next-line unused-imports/no-unused-vars
    let h3App: App
    let fetch: ReturnType<typeof createFetch>

    beforeAll(async () => {
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
    })

    afterAll(async () => {
      h3App = undefined
      await listener?.close()
    })

    it('returns 200 OK with gzip compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'gzip')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('gzip')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with deflate compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'deflate')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('deflate')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with brotli compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'br')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('br')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with zstandard compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'zstd')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('zstd')
      expect(body).toMatchObject(data.body)
    })

    it('can handle concurrency', {
      timeout: 60000,
    }, async () => {
      const encodingMethods = ['gzip', 'deflate', 'br', 'zstd'] as const

      const result = await concurrent(
        encodingMethods.map(method => () => requestEncoding(fetch, method)),
      )

      for (const [i, method] of encodingMethods.entries()) {
        expect(result[i].status).toEqual(200)
        expect(result[i].headers['content-encoding']).toEqual(method)
        expect(result[i].body).toMatchObject(data.body)
      }
    })
  })

  describe('compress with opts.chunkedTransferEncoding disabled', () => {
    let listener: Awaited<ReturnType<typeof listen>>
    let baseURL: string
    // eslint-disable-next-line unused-imports/no-unused-vars
    let h3App: App
    let fetch: ReturnType<typeof createFetch>

    beforeAll(async () => {
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
    })

    afterAll(async () => {
      h3App = undefined
      await listener?.close()
    })

    it('returns 200 OK with gzip compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'gzip')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('gzip')
      expect(body).toMatchObject(data.body)
      expect(Number.parseInt(headers['content-length'])).toEqual(data.size.gzip)
    })

    it('returns 200 OK with deflate compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'deflate')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('deflate')
      expect(body).toMatchObject(data.body)
      expect(Number.parseInt(headers['content-length'])).toEqual(data.size.deflate)
    })

    it('returns 200 OK with brotli compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'br')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('br')
      expect(body).toMatchObject(data.body)
      expect(Number.parseInt(headers['content-length'])).toEqual(data.size.br)
    })

    it('returns 200 OK with zstandard compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'zstd')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('zstd')
      expect(body).toMatchObject(data.body)
      expect(Number.parseInt(headers['content-length'])).toEqual(data.size.zstd)
    })

    it('can handle concurrency', {
      timeout: 60000,
    }, async () => {
      const encodingMethods = ['gzip', 'deflate', 'br', 'zstd'] as const

      const result = await concurrent(
        encodingMethods.map(method => () => requestEncoding(fetch, method)),
      )

      for (const [i, method] of encodingMethods.entries()) {
        expect(result[i].status).toEqual(200)
        expect(result[i].headers['content-encoding']).toEqual(method)
        expect(result[i].body).toMatchObject(data.body)
        expect(Number.parseInt(result[i].headers['content-length'])).toEqual(data.size[method])
      }
    })
  })

  describe('compress with opts.returnReadableStream', () => {
    let listener: Awaited<ReturnType<typeof listen>>
    let baseURL: string
    // eslint-disable-next-line unused-imports/no-unused-vars
    let h3App: App
    let fetch: ReturnType<typeof createFetch>

    beforeAll(async () => {
      h3App = undefined
      await listener?.close()

      const { useCompression } = await import('@blokwise/h3-compression')
      const server = await createH3App({
        body: data.body,
        handler: useCompression,
        opts: {
          chunkedTransferEncoding: {
            returnReadableStream: true,
          },
        },
        debug: DEBUG,
      })

      h3App = server.app
      listener = server.listener
      baseURL = server.baseURL
      fetch = createFetch({ baseURL, debug: DEBUG })
    })

    afterAll(async () => {
      h3App = undefined
      await listener?.close()
    })

    it('returns 200 OK with gzip compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'gzip')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('gzip')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with deflate compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'deflate')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('deflate')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with brotli compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'br')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('br')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with zstandard compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'zstd')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('zstd')
      expect(body).toMatchObject(data.body)
    })

    it('can handle concurrency', {
      timeout: 60000,
    }, async () => {
      const encodingMethods = ['gzip', 'deflate', 'br', 'zstd'] as const

      const result = await concurrent(
        encodingMethods.map(method => () => requestEncoding(fetch, method)),
      )

      for (const [i, method] of encodingMethods.entries()) {
        expect(result[i].status).toEqual(200)
        expect(result[i].headers['content-encoding']).toEqual(method)
        expect(result[i].body).toMatchObject(data.body)
      }
    })
  })
})
