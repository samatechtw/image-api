import { ImagePool } from '@squoosh/lib'
import IOptimizer from '../Interface/IOptimizer'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'

export default class SquooshOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizeAlgo[] = [EnumJpegOptimizeAlgo.mozjpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumJpegOptimizeAlgo,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumJpegOptimizeAlgo.mozjpeg:
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

    throw `Algo ${algo} is not supported`
  }
}
