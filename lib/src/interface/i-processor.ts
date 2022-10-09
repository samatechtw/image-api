import { EnumFileFormat } from '@samatech/image-api-types'

export interface IProcessor {
  readFormats: EnumFileFormat[]
  writeFormats: EnumFileFormat[]

  resize: (buffer: Uint8Array, width: number, height: number) => Promise<Uint8Array>
  convert: (buffer: Uint8Array, toFormat: EnumFileFormat) => Promise<Uint8Array>
}
