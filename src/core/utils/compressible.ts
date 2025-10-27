import { Buffer } from 'node:buffer'
import { isObject, isString } from '@antfu/utils'

/**
 * Check if the provided data is in a compressible format (`string` or `object-like` structure, such as `JSON`).
 *
 * @param data Data to check.
 *
 * @returns `true` if the data is compressible, otherwise `false`.
 *
 * @since 0.4.0
 */
export function isCompressibleFormat<T extends string | object>(
  data: T | unknown,
) {
  return isString(data) || isObject(data)
}

/**
 * Get the size of the provided data.
 *
 * @param data Data to get the size of.
 *
 * @returns Size of the provided data or `-1` if size cannot be determined.
 *
 * @since 0.4.0
 */
export function getSize<T extends string | object>(
  data: T | unknown,
) {
  if (isString(data)) {
    return data.length
  }

  if (isObject(data)) {
    return JSON.stringify(data).length
  }

  return -1
}

/**
 * Get the provided data in a compressible format (`Buffer` from `string`).
 *
 * @param data Data to convert.
 *
 * @returns Compressible format.
 *
 * @since 0.4.0
 */
export function getCompressible<T extends string | object>(
  data: T | unknown,
) {
  if (isString(data)) {
    return Buffer.from(data)
  }

  if (isObject(data)) {
    return Buffer.from(JSON.stringify(data))
  }

  throw new Error('Response body is not compressable')
}
