import { ImagePool } from '@squoosh/lib'
import IOptimizer from '../Interface/IOptimizer'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'

export default class JpegOptimizer implements IOptimizer {
  acceptFormats: EnumFileFormat[] = [EnumFileFormat.jpg, EnumFileFormat.jpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumJpegOptimizeAlgo,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumJpegOptimizeAlgo.mozJpeg:
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
