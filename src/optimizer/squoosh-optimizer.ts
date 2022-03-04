import { ImagePool } from '@squoosh/lib'
import { IOptimizer } from '../interface/i-optimizer'
import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'

export class SquooshOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[] = [EnumOptimizationAlgorithm.mozjpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.mozjpeg: {
        const imagePool = new ImagePool()
        const image = imagePool.ingestImage(buffer)

        await image.encode({
          mozjpeg: {
            quality: quality,
          },
        })

        imagePool.close()

        const res = await image.encodedWith.mozjpeg

        return res.binary
      }
    }

    throw `Algo ${algo} is not supported in Squoosh optimizer`
  }
}
