import * as Buffer from 'buffer'
import { EnumFileFormat } from '../enum'

export interface IProcessor {
  readFormats: EnumFileFormat[]
  writeFormats: EnumFileFormat[]

  resize: (buffer: Buffer, width: number, height: number) => Promise<Buffer>
  convert: (buffer: Buffer, toFormat: EnumFileFormat) => Promise<Buffer>
}
