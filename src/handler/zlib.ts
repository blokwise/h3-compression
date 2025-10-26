import type { EncodingMethod } from '../types'
import z from 'node:zlib'
import { EncodingMethods } from '../enums'

export const zlib = (function () {
  const availableMethods = [
    'zstdCompress' in z ? [EncodingMethods.Zstandard, 'zstdCompress'] as const : undefined,
    'brotliCompress' in z ? [EncodingMethods.Brotli, 'brotliCompress'] as const : undefined,
    'gzip' in z ? [EncodingMethods.GZip, 'gzip'] as const : undefined,
    'deflate' in z ? [EncodingMethods.Deflate, 'deflate'] as const : undefined,
  ].filter(Boolean)

  return {
    constants: z.constants,
    availableMethods: availableMethods.map(([key, _]) => key),
    ...Object.fromEntries(availableMethods.map(([key, method]) => [key, (z as any)[method]])),
  } as {
    constants: typeof z.constants
    availableMethods: EncodingMethod[]
    zstd?: typeof z.zstdCompress
    br: typeof z.brotliCompress
    gzip: typeof z.gzip
    deflate: typeof z.deflate
  }
}())
