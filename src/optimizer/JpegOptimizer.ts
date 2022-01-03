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
      case EnumJpegOptimizeAlgo.jpegOptim:

      case EnumJpegOptimizeAlgo.jpegRecompress:

      case EnumJpegOptimizeAlgo.jpegTran:

      case EnumJpegOptimizeAlgo.mozJpeg:
    }

    throw `Algo ${algo} is not supported`
  }
}
