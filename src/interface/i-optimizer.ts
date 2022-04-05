import * as Buffer from 'buffer'
import { EnumOptimizationAlgorithm } from '../enum'

export interface IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[]

  optimize: (
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ) => Promise<Buffer>
}
