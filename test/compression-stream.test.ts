import type { App } from 'h3'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'

describe('use compression', () => {
  let app: App
  let request: ReturnType<typeof supertest>

  beforeEach(async () => {
    const { useCompressionStream } = await import('@blokwise/h3-compression')

    app = createApp({ debug: true, onBeforeResponse: useCompressionStream })
    app.use('/', eventHandler({
      handler: () => {
        return '<h1>Hello World</h1>'
      },
    }))
    request = supertest(toNodeListener(app))
  })

  it('returns 200 OK with gzip compression stream', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'gzip')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('gzip')
  })

  it('returns 200 OK with deflate compression stream', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'deflate')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('deflate')
  })

  it.skip('returns 200 OK with brotli compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'br')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('br')
  })

  it.skip('returns 200 OK with zstandard compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'zstd')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('zstd')
  })
})
