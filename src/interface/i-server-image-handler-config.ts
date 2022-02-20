import { OptimizationAlgorithm } from '../enum/optimization-algorithm'
import { FileFormat } from '../enum/file-format'

export interface IServerImageHandlerConfig {
  inputFormat: FileFormat
  outputFormat?: FileFormat
  width?: number
  height?: number
  optimizeAlgo?: OptimizationAlgorithm
  quality?: number
}
