import type { App } from 'h3'
import type { listen } from 'listhen'
import { afterAll, beforeAll, describe, expect, it, suite } from 'vitest'
import { createFetch, createH3App, loadJsonData, requestEncoding } from '../utils'

suite('useCompressionStream', async () => {
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

  describe('compress', () => {
    let listener: Awaited<ReturnType<typeof listen>>
    let baseURL: string
    // eslint-disable-next-line unused-imports/no-unused-vars
    let h3App: App
    let fetch: ReturnType<typeof createFetch>

    beforeAll(async () => {
      h3App = undefined
      await listener?.close()

      const { useCompressionStream } = await import('@blokwise/h3-compression')
      const server = await createH3App({
        body: data.body,
        handler: useCompressionStream,
      })

      h3App = server.app
      listener = server.listener
      baseURL = server.baseURL
      fetch = createFetch({ baseURL })
    })

    afterAll(async () => {
      h3App = undefined
      await listener?.close()
    })

    it('returns 200 OK with gzip compression stream', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'gzip')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('gzip')
      expect(body).toMatchObject(data.body)
    })

    it('returns 200 OK with deflate compression stream', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'deflate')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('deflate')
      expect(body).toMatchObject(data.body)
    })

    it.skip('returns 200 OK with brotli compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'br')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('br')
      expect(body).toMatchObject(data.body)
    })

    it.skip('returns 200 OK with zstandard compression', {
      timeout: 20000,
    }, async () => {
      const { status, headers, body } = await requestEncoding(fetch, 'zstd')

      expect(status).toEqual(200)
      expect(headers['content-encoding']).toEqual('zstd')
      expect(body).toMatchObject(data.body)
    })
  })
})
