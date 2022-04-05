import { EnumOptimizationAlgorithm, EnumFileFormat } from '../enum'

export interface IServerImageHandlerConfig {
  inputFormat: EnumFileFormat
  outputFormat?: EnumFileFormat
  width?: number
  height?: number
  optimizeAlgo?: EnumOptimizationAlgorithm
  quality?: number
  s3Region?: string
  s3BucketName?: string
}
