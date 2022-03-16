import sharp from 'sharp'
import { IProcessor } from '../interface/i-processor'
import { EnumFileFormat } from '../enum/enum-file-format'

export class SharpProcessor implements IProcessor {
  readFormats: EnumFileFormat[] = [
    EnumFileFormat.jpg,
    EnumFileFormat.jpeg,
    EnumFileFormat.png,
    EnumFileFormat.webp,
    EnumFileFormat.avif,
    EnumFileFormat.tiff,
    EnumFileFormat.gif,
    EnumFileFormat.svg,
  ]

  writeFormats: EnumFileFormat[] = [
    EnumFileFormat.jpg,
    EnumFileFormat.jpeg,
    EnumFileFormat.png,
    EnumFileFormat.webp,
    EnumFileFormat.avif,
    EnumFileFormat.tiff,
  ]

  async convert(buffer: Buffer, toFormat: EnumFileFormat): Promise<Buffer> {
    switch (toFormat) {
      case EnumFileFormat.jpg:
        return await sharp(buffer).jpeg().toBuffer()
      case EnumFileFormat.jpeg:
        return await sharp(buffer).jpeg().toBuffer()
      case EnumFileFormat.png:
        return await sharp(buffer).png().toBuffer()
      case EnumFileFormat.webp:
        return await sharp(buffer).webp().toBuffer()
      case EnumFileFormat.avif:
        return await sharp(buffer).webp().toBuffer()
      case EnumFileFormat.tiff:
        return await sharp(buffer).tiff().toBuffer()
    }

    throw 'Output format not supported by Sharp'
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(buffer)
      .resize(width, height, {
        fit: 'fill',
      })
      .toBuffer()
  }
}
