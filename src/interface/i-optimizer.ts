import * as Buffer from 'buffer'
import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'

export interface IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[]

  optimize: (
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ) => Promise<Buffer>
}
