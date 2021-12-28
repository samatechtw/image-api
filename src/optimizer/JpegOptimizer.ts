import IOptimizer from '../Interface/IOptimizer'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import * as sharp from 'sharp'

export default class JpegOptimizer implements IOptimizer {
  acceptFormats: EnumFileFormat[] = [EnumFileFormat.jpg, EnumFileFormat.jpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumJpegOptimizeAlgo,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumJpegOptimizeAlgo.mozJpeg:
        return await sharp(buffer)
          .jpeg({
            mozjpeg: true,
            quality: quality,
          })
          .toBuffer()
    }

    throw `Algo ${algo} is not supported`
  }
}
