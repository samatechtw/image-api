import { EnumOptimizationAlgorithm } from '../enum'

export interface IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[]

  optimize: (
    buffer: Uint8Array,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ) => Promise<Uint8Array>
}
