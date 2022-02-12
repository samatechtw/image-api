import * as Buffer from 'buffer'
import { FileFormat } from '../enum/file-format'

export interface IProcessor {
  readFormats: FileFormat[]
  writeFormats: FileFormat[]

  resize: (buffer: Buffer, width: number, height: number) => Promise<Buffer>
  convert: (buffer: Buffer, toFormat: FileFormat) => Promise<Buffer>
}
