import { ImagePool } from '@squoosh/lib'
import { IOptimizer } from '../interface/i-optimizer'
import { JpegOptimizeAlgo } from '../enum/jpeg-optimize-algo'
import { OptimizeAlgo } from '../enum/optimize-algo'

export class SquooshOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizeAlgo[] = [JpegOptimizeAlgo.mozjpeg]

  async optimize(buffer: Buffer, algo: OptimizeAlgo, quality: number): Promise<Buffer> {
    switch (algo) {
      case JpegOptimizeAlgo.mozjpeg: {
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
