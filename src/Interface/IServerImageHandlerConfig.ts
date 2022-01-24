import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'
import EnumFileFormat from '../Enum/EnumFileFormat'

export default interface IServerImageHandlerConfig {
  inputFormat: EnumFileFormat
  outputFormat?: EnumFileFormat
  width?: number
  height?: number
  optimizeAlgo?: EnumOptimizeAlgo
  quality?: number
}
