import { EnumFileFormat, EnumOptimizationAlgorithm } from '../enum'

export interface IImageJobConfig {
  inputFormat: EnumFileFormat
  outputFormat?: EnumFileFormat
  width?: number
  height?: number
  optimizeAlgo?: EnumOptimizationAlgorithm
  quality?: number
  uploadUrl?: string
}
