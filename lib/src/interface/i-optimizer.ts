import { EnumOptimizationAlgorithm } from '@samatech/image-api-types'

export interface IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[]

  optimize: (
    buffer: Uint8Array,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ) => Promise<Uint8Array>
}
