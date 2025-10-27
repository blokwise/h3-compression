export {
  compress,
  compressStream,
  detectMostSuitableEncodingMethod,
  EncodingMethods,
  StreamEncodingMethods,
} from './core'

export {
  useBrotliCompression,
  useCompression,
  useDeflateCompression,
  useGZipCompression,
  useZstdCompression,
} from './useCompression'

export {
  useCompressionStream,
  useDeflateCompressionStream,
  useGZipCompressionStream,
} from './useCompressionStream'
