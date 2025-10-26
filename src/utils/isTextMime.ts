/**
 * Check if the given `MIME` type is a text-based format.
 *
 * @param type `MIME` type to check.
 *
 * @returns `true` if the `MIME` type is text-based, otherwise `false`.
 */
export function isTextMime(
  type: string,
) {
  return /text|javascript|json|xml/.test(type)
}
