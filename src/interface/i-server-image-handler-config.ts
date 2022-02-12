import { OptimizeAlgo } from '../enum/optimize-algo'
import { FileFormat } from '../enum/file-format'

export interface IServerImageHandlerConfig {
  inputFormat: FileFormat
  outputFormat?: FileFormat
  width?: number
  height?: number
  optimizeAlgo?: OptimizeAlgo
  quality?: number
}
