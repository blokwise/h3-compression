import type { ofetch } from 'ofetch'

export async function requestEncoding<T>(
  fetch: ((...args: Parameters<typeof ofetch>) => Promise<{
    status: number
    headers: Record<string, string>
    body: T
  }>),
  acceptEncoding: 'gzip' | 'deflate' | 'br' | 'zstd',
) {
  return await fetch('/compressed', {
    headers: {
      'Accept-Encoding': acceptEncoding,
    },
  })
}
