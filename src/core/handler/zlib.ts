import type { EncodingMethod } from '../types'
import z from 'node:zlib'
import { upperFirst } from 'scule'
import { EncodingMethods } from '../enums'

export const zlib = (function () {
  const availableMethods = [
    'zstdCompress' in z ? [EncodingMethods.Zstandard, 'zstdCompress', 'zstdDecompress'] as const : undefined,
    'brotliCompress' in z ? [EncodingMethods.Brotli, 'brotliCompress', 'brotliDecompress'] as const : undefined,
    'gzip' in z ? [EncodingMethods.GZip, 'gzip', 'gunzip'] as const : undefined,
    'deflate' in z ? [EncodingMethods.Deflate, 'deflate', 'inflate'] as const : undefined,
  ].filter(Boolean)

  return {
    constants: z.constants,
    availableMethods: availableMethods.map(([method, _]) => method),
    encode: {
      ...Object.fromEntries(availableMethods.map(([method, encode, _]) => [method, (z as any)[encode]])),
      ...Object.fromEntries(availableMethods.map(([method, encode, _]) => [`create${upperFirst(method)}`, (z as any)[`create${upperFirst(encode)}`]])),
    },
    decode: {
      ...Object.fromEntries(availableMethods.map(([method, _, decode]) => [method, (z as any)[decode]])),
      ...Object.fromEntries(availableMethods.map(([method, _, decode]) => [`create${upperFirst(method)}`, (z as any)[`create${upperFirst(decode)}`]])),
    },
  } as {
    constants: typeof z.constants
    availableMethods: EncodingMethod[]
    encode: {
      zstd?: typeof z.zstdCompress
      br: typeof z.brotliCompress
      gzip: typeof z.gzip
      deflate: typeof z.deflate
      createZstd?: typeof z.createZstdCompress
      createBr: typeof z.createBrotliCompress
      createGzip: typeof z.createGzip
      createDeflate: typeof z.createDeflate
    }
    decode: {
      zstd?: typeof z.zstdDecompress
      br: typeof z.brotliDecompress
      gzip: typeof z.gunzip
      deflate: typeof z.inflate
      createZstd?: typeof z.createZstdDecompress
      createBr: typeof z.createBrotliDecompress
      createGzip: typeof z.createGunzip
      createDeflate: typeof z.createInflate
    }
  }
}())
