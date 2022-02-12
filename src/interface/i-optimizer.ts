import * as Buffer from 'buffer'
import { OptimizeAlgo } from '../enum/optimize-algo'

export interface IOptimizer {
  acceptAlgorithms: OptimizeAlgo[]

  optimize: (buffer: Buffer, algo: OptimizeAlgo, quality: number) => Promise<Buffer>
}
