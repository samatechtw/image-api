import * as Buffer from 'buffer'
import { EnumFileFormat } from '../Enum/EnumFileFormat'

export interface ILoader {
  resize: (width: number, height: number) => Buffer
  convert: (toFormat: EnumFileFormat) => Buffer
  optimize: () => Buffer
  thumbnail: () => Buffer
}
