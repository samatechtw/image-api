import { ImagePool } from '@squoosh/lib'
import { EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import { IOptimizer } from '../interface'

export class SquooshOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[] = [EnumOptimizationAlgorithm.mozjpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.mozjpeg: {
        delete globalThis.navigator
        const imagePool = new ImagePool()
        const image = imagePool.ingestImage(buffer)

        await image.encode({
          mozjpeg: { quality },
        })

        await imagePool.close()

        const res = await image.encodedWith.mozjpeg

        return res.binary
      }
    }

    throw `Algo ${algo} is not supported in Squoosh optimizer`
  }
}
