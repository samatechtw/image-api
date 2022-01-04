import * as Buffer from 'buffer'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'

export default interface IOptimizer {
  acceptAlgorithms: EnumOptimizeAlgo[]

  optimize: (buffer: Buffer, algo: EnumOptimizeAlgo, quality: number) => Promise<Buffer>
}
