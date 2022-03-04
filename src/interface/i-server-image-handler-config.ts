import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'
import { EnumFileFormat } from '../enum/enum-file-format'

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
