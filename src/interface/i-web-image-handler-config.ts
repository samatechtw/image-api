import { EnumOptimizationAlgorithm, EnumFileFormat } from '../enum'

export interface IWebImageHandlerConfig {
  inputFormat: EnumFileFormat
  outputFormat?: EnumFileFormat
  width?: number
  height?: number
  optimizeAlgo?: EnumOptimizationAlgorithm
  quality?: number
}
