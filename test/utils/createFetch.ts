import { ofetch } from 'ofetch'

export function createFetch(config: {
  baseURL: string
}) {
  return async (...args: Parameters<typeof ofetch>) => {
    const url = args[0] ?? '/compressed'
    const opts = {
      baseURL: config.baseURL,
      ...(args[1] ?? {}),
    }

    const response = await ofetch.raw(url, opts)

    // eslint-disable-next-line no-console
    console.log('response headers received ', Object.fromEntries(response.headers.entries()))

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: response._data,
    }
  }
}
