import IOptimizer from '../Interface/IOptimizer'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'
import EnumSvgOptimizeAlgo from '../Enum/EnumSvgOptimizeAlgo'
import * as svgo from 'svgo'
import { Buffer } from 'buffer'

class SvgoOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizeAlgo[] = [EnumSvgOptimizeAlgo.svgo]

  async optimize(
    buffer: Buffer,
    algo: EnumOptimizeAlgo,
    quality: number,
  ): Promise<Buffer> {
    const svgStr = buffer.toString('utf8')
    const res = svgo.optimize(svgStr)
    const resBuffer = Buffer.from(res.data)

    return resBuffer
  }
}

export default SvgoOptimizer
