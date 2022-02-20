import * as Buffer from 'buffer'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'

export interface IOptimizer {
  acceptAlgorithms: OptimizationAlgorithm[]

  optimize: (
    buffer: Buffer,
    algo: OptimizationAlgorithm,
    quality: number,
  ) => Promise<Buffer>
}
