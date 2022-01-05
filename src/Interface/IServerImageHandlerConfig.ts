import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'

export default interface IServerImageHandlerConfig {
  width?: number
  height?: number
  inputFormat?: EnumFileFormat
  outputFormat?: EnumFileFormat
  optimizeAlgo?: EnumOptimizeAlgo
  quality?: number
}
