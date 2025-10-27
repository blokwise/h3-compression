export type {
  EncodingMethods,
} from './core/enums'

export {
  createAsyncCompressionHandler,
  createStreamCompressionHandler,
  getCompressionHandler,
} from './core/handler'

export type {
  CompressionHandler,
  EncodingMethod,
} from './core/types'

export {
  getCompressible,
  getSize,
  isTextMime,
} from './core/utils'
