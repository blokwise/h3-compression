import type { App } from 'h3'
import { createApp, eventHandler, toNodeListener } from 'h3'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { useCompression } from '../src'

describe('use compression', () => {
  let app: App
  let request: ReturnType<typeof supertest>

  beforeEach(() => {
    app = createApp({ debug: true, onBeforeResponse: useCompression })
    app.use('/', eventHandler({
      handler: () => {
        return '<h1>Hello World</h1>'.repeat(1000)
      },
    }))
    request = supertest(toNodeListener(app))
  })

  it('returns 200 OK with gzip compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'gzip')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('gzip')
    expect(Number.parseInt(result.headers['content-length'])).toEqual(111)
  })

  it('returns 200 OK with deflate compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'deflate')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('deflate')
    expect(Number.parseInt(result.headers['content-length'])).toEqual(99)
  })

  it('returns 200 OK with brotli compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'br')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('br')
    expect(Number.parseInt(result.headers['content-length'])).toEqual(34)
  })

  it('returns 200 OK with zstandard compression', async () => {
    const result = await request
      .get('/')
      .set('Accept-Encoding', 'zstd')

    expect(result.status).toEqual(200)
    expect(result.headers['content-encoding']).toEqual('zstd')
    expect(Number.parseInt(result.headers['content-length'])).toEqual(37)
  })
})
