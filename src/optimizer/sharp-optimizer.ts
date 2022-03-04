import { IOptimizer } from '../interface/i-optimizer'
import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'
import sharp from 'sharp'

export class SharpOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[] = [
    EnumOptimizationAlgorithm.mozjpeg,
    EnumOptimizationAlgorithm.jpegCompress,
    EnumOptimizationAlgorithm.pngCompress,
    EnumOptimizationAlgorithm.webpCompress,
    EnumOptimizationAlgorithm.tiffCompress,
    EnumOptimizationAlgorithm.heifCompress,
    EnumOptimizationAlgorithm.avifCompress,
  ]

  async optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.mozjpeg:
        return await sharp(buffer)
          .jpeg({
            quality: quality,
            mozjpeg: true,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.jpegCompress:
        return await sharp(buffer)
          .jpeg({
            quality: quality,
            mozjpeg: false,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.pngCompress:
        return await sharp(buffer)
          .png({
            quality: quality,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.webpCompress:
        return await sharp(buffer)
          .webp({
            quality: quality,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.tiffCompress:
        return await sharp(buffer)
          .tiff({
            quality: quality,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.heifCompress:
        return await sharp(buffer)
          .heif({
            quality: quality,
          })
          .toBuffer()
      case EnumOptimizationAlgorithm.avifCompress:
        return await sharp(buffer)
          .avif({
            quality: quality,
          })
          .toBuffer()
    }

    throw `Algo ${algo} is not supported in SharpOptimizer`
  }
}
