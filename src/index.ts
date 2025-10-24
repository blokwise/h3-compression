export {
  useBrotliCompression,
  useCompression,
  useDeflateCompression,
  useGZipCompression,
  useZstdCompression,
} from './compression'

export {
  useCompressionStream,
  useDeflateCompressionStream,
  useGZipCompressionStream,
} from './compressionStream'

export {
  EncodingMethods,
  StreamEncodingMethods,
} from './enums'

export {
  compress,
  compressStream,
  detectMostSuitableEncodingMethod,
} from './helper'
