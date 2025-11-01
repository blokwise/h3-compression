import { readFile } from 'node:fs/promises'
import { createTective } from '@blokwise/tective'

export function loadJsonData(
  filename: string,
) {
  return readFile(
    createTective({ url: import.meta.url }).resolve(`./../data/${filename}`),
    'utf-8',
  ).then(data => JSON.parse(data))
}
