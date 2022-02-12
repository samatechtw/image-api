import { JpegOptimizeAlgo } from './jpeg-optimize-algo'
import { PngOptimizeAlgo } from './png-optimize-algo'
import { SvgOptimizeAlgo } from './svg-optimize-algo'
import { GifOptimizeAlgo } from './gif-optimize-algo'

export type OptimizeAlgo =
  | JpegOptimizeAlgo
  | PngOptimizeAlgo
  | SvgOptimizeAlgo
  | GifOptimizeAlgo
