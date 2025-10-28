export {
  EncodingMethods,
} from './core/enums'

export {
  asStream,
  toAsync,
  useHandler,
} from './core/handler'

export type {
  DecodingHandler,
  DecodingOptions,
  EncodingHandler,
  EncodingMethod,
  EncodingOptions,
  Handler,
} from './core/types'

export {
  getCompressible,
  getSize,
  isTextMime,
} from './core/utils'
