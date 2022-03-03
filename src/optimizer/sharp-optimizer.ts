import { IOptimizer } from "../interface/i-optimizer";
import { OptimizationAlgorithm } from "../enum/optimization-algorithm";
import sharp from "sharp";

export class SharpOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizationAlgorithm[] = [
    OptimizationAlgorithm.mozjpeg,
    OptimizationAlgorithm.jpegCompress,
    OptimizationAlgorithm.pngCompress,
    OptimizationAlgorithm.webpCompress,
    OptimizationAlgorithm.tiffCompress,
    OptimizationAlgorithm.heifCompress,
    OptimizationAlgorithm.avifCompress,
  ]

  async optimize(buffer: Buffer, algo: OptimizationAlgorithm, quality: number): Promise<Buffer> {
    switch (algo) {
      case OptimizationAlgorithm.mozjpeg:
        return await sharp(buffer).jpeg({
          quality: quality,
          mozjpeg: true,
        }).toBuffer()
      case OptimizationAlgorithm.jpegCompress:
        return await sharp(buffer).jpeg({
          quality: quality,
          mozjpeg: false,
        }).toBuffer()
      case OptimizationAlgorithm.pngCompress:
        return await sharp(buffer).png({
          quality: quality,
        }).toBuffer()
      case OptimizationAlgorithm.webpCompress:
        return await sharp(buffer).webp({
          quality: quality,
        }).toBuffer()
      case OptimizationAlgorithm.tiffCompress:
        return await sharp(buffer).tiff({
          quality: quality,
        }).toBuffer()
      case OptimizationAlgorithm.heifCompress:
        return await sharp(buffer).heif({
          quality: quality,
        }).toBuffer()
      case OptimizationAlgorithm.avifCompress:
        return await sharp(buffer).avif({
          quality: quality,
        }).toBuffer()
    }

    throw `Algo ${algo} is not supported in SharpOptimizer`
  }
}
