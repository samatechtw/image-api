import { EnumFileFormat } from '../Enum/EnumFileFormat'
import * as Buffer from 'buffer'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'

export default interface IOptimizer {
  acceptFormats: EnumFileFormat[]

  optimize: (
    buffer: Buffer,
    algo: EnumJpegOptimizeAlgo,
    quality: number,
  ) => Promise<Buffer>
}
