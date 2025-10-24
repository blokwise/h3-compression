# `@blokwise/h3-compression`

> Handles compression for H3

## Features

✔️ &nbsp;**Zlib Compression:** You can use zlib compression (zstandard, brotli, gzip, deflate)

✔️ &nbsp;**Stream Compression:** You can use native stream compressions (gzip, deflate)

✔️ &nbsp;**Compression Detection:** Uses the best compression which is accepted

## Getting started

```bash
# using npm
npm install @blokwise/h3-compression

# using yarn
yarn add @blokwise/h3-compression

# using pnpm
pnpm install @blokwise/h3-compression
```

## Usage

```ts
import { createServer } from 'node:http'
import { useCompressionStream } from '@blokwise/h3-compression'
import { createApp, eventHandler, toNodeListener } from 'h3'

const app = createApp({ onBeforeResponse: useCompressionStream }) // or { onBeforeResponse: useCompression }
app.use(
  '/',
  eventHandler(() => 'Hello world!'),
)

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)
```

Example using <a href="https://github.com/unjs/listhen">listhen</a> for an elegant listener:

```ts
import { useCompressionStream } from '@blokwise/h3-compression'
import { createApp, eventHandler, toNodeListener } from 'h3'
import { listen } from 'listhen'

const app = createApp({ onBeforeResponse: useCompressionStream }) // or { onBeforeResponse: useCompression }
app.use(
  '/',
  eventHandler(() => 'Hello world!'),
)

listen(toNodeListener(app))
```

## Nuxt 3/4

If you want to use it in nuxt 3 you can define a nitro plugin.

`server/plugins/compression.ts`
````ts
import { useCompression } from '@blokwise/h3-compression'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:response', async (response, { event }) => {
    if (!response.headers?.['content-type'].startsWith('text/html')) {
      return
    }

    await useCompression(event, response)
  })
})
````
> [!NOTE]
> `useCompressionStream` doesn't work right now in nitro. So you just can use `useCompression`

## API

H3-compression has a concept of composable utilities that accept `event` (from `eventHandler((event) => {})`) as their first argument and `response` as their second.

### Compression

- `useGZipCompression(event: H3Event, response: { body: unknown }): Promise<void>`
- `useDeflateCompression(event: H3Event, response: { body: unknown }): Promise<void>`
- `useBrotliCompression(event: H3Event, response: { body: unknown }): Promise<void>`
- `useZstdCompression(event: H3Event, response: { body: unknown }): Promise<void>`
- `useCompression(event: H3Event, response: { body: unknown }): Promise<void>`

### Stream Compression

- `useGZipCompressionStream(event: H3Event, response: { body: unknown }): Promise<void>`
- `useDeflateCompressionStream(event: H3Event, response: { body: unknown }): Promise<void>`
- `useCompressionStream(event: H3Event, response: { body: unknown }): Promise<void>`

### Utilities

- `compress(event: H3Event, data: unknown, method: 'gzip' | 'deflate' | 'br' | 'zstd'): Promise<Buffer<ArrayBufferLike> | unknown>`
- `compressStream(event: H3Event, data: unknown, method: 'gzip' | 'deflate' | 'br' | 'zstd'): Promise<ReadableStream<any>>`
- `detectMostSuitableEncodingMethod(event: H3Event, allowedMethods?: ('zstd' | 'br' | 'gzip' | 'deflate')[]): 'zstd' | 'br' | 'gzip' | 'deflate' | undefined`

## Related Projects

- [h3](https://github.com/unjs/h3)
- [h3-compression](https://github.com/CodeDredd/h3-compression)
- [h3-fast-compression](https://github.com/TimGonnet/h3-fast-compression)

## License

[MIT](./LICENSE) License © 2023-PRESENT [Julian Derungs](https://github.com/aerophobic)
