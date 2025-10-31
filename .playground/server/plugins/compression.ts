import { useCompression } from '@blokwise/h3-compression'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:response', async (response, { event }) => {
    if (!response.headers?.['content-type'].startsWith('text/html')) {
      return
    }

    await useCompression(event, response)
  })
})
