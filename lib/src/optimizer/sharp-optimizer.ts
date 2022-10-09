import { EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import sharp from 'sharp'
import { IOptimizer } from '../interface'

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

  optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.mozjpeg:
        return sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer()
      case EnumOptimizationAlgorithm.jpegCompress:
        return sharp(buffer).jpeg({ quality, mozjpeg: false }).toBuffer()
      case EnumOptimizationAlgorithm.pngCompress:
        return sharp(buffer).png({ quality, palette: true, colors: 128 }).toBuffer()
      case EnumOptimizationAlgorithm.webpCompress:
        return sharp(buffer).webp({ quality }).toBuffer()
      case EnumOptimizationAlgorithm.tiffCompress:
        return sharp(buffer).tiff({ quality }).toBuffer()
      case EnumOptimizationAlgorithm.heifCompress:
        return sharp(buffer).heif({ quality }).toBuffer()
      case EnumOptimizationAlgorithm.avifCompress:
        return sharp(buffer).avif({ quality }).toBuffer()
    }

    throw `Algo ${algo} is not supported in SharpOptimizer`
  }
}
