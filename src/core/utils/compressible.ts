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
 * Get the provided data as string if possible (`object` or `string`).
 *
 * @param data Data to convert.
 *
 * @returns Data as `string` or throws an error if not possible.
 *
 * @since 0.4.0
 */
export function asString<T extends string | object>(
  data: T | unknown,
) {
  if (isString(data)) {
    return data
  }

  if (isObject(data)) {
    return JSON.stringify(data)
  }

  throw new Error('Data cannot be converted to string')
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
  try {
    return asString(data).length
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e: Error | unknown) {
    return -1
  }
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
  try {
    return Buffer.from(asString(data))
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (e: Error | unknown) {
    throw new Error('Data is not compressible')
  }
}
