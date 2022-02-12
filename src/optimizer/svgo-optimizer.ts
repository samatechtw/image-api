import * as svgo from 'svgo'
import { Buffer } from 'buffer'
import { IOptimizer } from '../interface/i-optimizer'
import { OptimizeAlgo } from '../enum/optimize-algo'
import { SvgOptimizeAlgo } from '../enum/svg-optimize-algo'

export class SvgoOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizeAlgo[] = [SvgOptimizeAlgo.svgo]

  async optimize(buffer: Buffer, algo: OptimizeAlgo, quality: number): Promise<Buffer> {
    switch (algo) {
      case SvgOptimizeAlgo.svgo: {
        const svgStr = buffer.toString('utf8')
        const res = svgo.optimize(svgStr)
        const resBuffer = Buffer.from(res['data'])

        return resBuffer
      }
    }

    throw `Algo ${algo} is not supported in SvgoOptimizer`
  }
}
