import IOptimizer from '../Interface/IOptimizer'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import imagemin from 'imagemin'
import imageminJpegoptim from 'imagemin-jpegoptim'
import imageminJpegRecompress from 'imagemin-jpeg-recompress'
import imageminJpegTran from 'imagemin-jpegtran'
import imageminMozJpeg from 'imagemin-mozjpeg'

export default class JpegOptimizer implements IOptimizer {
  acceptFormats: EnumFileFormat[] = [EnumFileFormat.jpg, EnumFileFormat.jpeg]

  async optimize(
    buffer: Buffer,
    algo: EnumJpegOptimizeAlgo,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumJpegOptimizeAlgo.jpegOptim:
        return await imagemin.buffer(buffer, {
          plugins: [
            imageminJpegoptim({
              max: quality,
            }),
          ],
        })
      case EnumJpegOptimizeAlgo.jpegRecompress:
        return await imagemin.buffer(buffer, {
          plugins: [
            imageminJpegRecompress({
              quality: quality,
            }),
          ],
        })
      case EnumJpegOptimizeAlgo.jpegTran: {
        return await imagemin.buffer(buffer, {
          plugins: [
            // no quality option for this algo
            imageminJpegTran(),
          ],
        })
      }
      case EnumJpegOptimizeAlgo.mozJpeg:
        return await imagemin.buffer(buffer, {
          plugins: [
            imageminMozJpeg({
              quality: quality,
            }),
          ],
        })
    }

    throw `Algo ${algo} is not supported`
  }
}
