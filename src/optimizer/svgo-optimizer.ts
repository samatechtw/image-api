import * as svgo from 'svgo'
import { Buffer } from 'buffer'
import { IOptimizer } from '../interface/i-optimizer'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'

export class SvgoOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizationAlgorithm[] = [OptimizationAlgorithm.svgo]

  async optimize(
    buffer: Buffer,
    algo: OptimizationAlgorithm,
    _quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case OptimizationAlgorithm.svgo: {
        const svgStr = buffer.toString('utf8')
        const res = svgo.optimize(svgStr)
        const resBuffer = Buffer.from(res['data'])

        return resBuffer
      }
    }

    throw `Algo ${algo} is not supported in SvgoOptimizer`
  }
}
