import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'

export default interface IServerImageHandlerConfig {
  inputFormat: EnumFileFormat
  outputFormat?: EnumFileFormat
  width?: number
  height?: number
  optimizeAlgo?: EnumOptimizeAlgo
  quality?: number
}
