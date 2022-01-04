import EnumJpegOpitmizeAlgo from './EnumJpegOpitmizeAlgo'
import EnumPngOptimizeAlgo from './EnumPngOptimizeAlgo'
import EnumSvgOptimizeAlgo from './EnumSvgOptimizeAlgo'
import EnumGifOptimizeAlgo from './EnumGifOptimizeAlgo'

type EnumOptimizeAlgo =
  | EnumJpegOpitmizeAlgo
  | EnumPngOptimizeAlgo
  | EnumSvgOptimizeAlgo
  | EnumGifOptimizeAlgo

export default EnumOptimizeAlgo
