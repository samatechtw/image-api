import sharp from 'sharp'
import { IProcessor } from '../interface/i-processor'
import { FileFormat } from '../enum/file-format'

export class SharpProcessor implements IProcessor {
  readFormats: FileFormat[] = [
    FileFormat.jpg,
    FileFormat.jpeg,
    FileFormat.png,
    FileFormat.webp,
    FileFormat.avif,
    FileFormat.tiff,
    FileFormat.gif,
    FileFormat.svg,
  ]

  writeFormats: FileFormat[] = [
    FileFormat.jpg,
    FileFormat.jpeg,
    FileFormat.png,
    FileFormat.webp,
    FileFormat.avif,
    FileFormat.tiff,
  ]

  async convert(buffer: Buffer, toFormat: FileFormat): Promise<Buffer> {
    switch (toFormat) {
      case FileFormat.jpg:
        return await sharp(buffer).jpeg().toBuffer()
      case FileFormat.jpeg:
        return await sharp(buffer).jpeg().toBuffer()
      case FileFormat.png:
        return await sharp(buffer).png().toBuffer()
      case FileFormat.webp:
        return await sharp(buffer).webp().toBuffer()
      case FileFormat.avif:
        return await sharp(buffer).webp().toBuffer()
      case FileFormat.tiff:
        return await sharp(buffer).tiff().toBuffer()
    }

    throw 'Output format not supported by Sharp'
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return await sharp(buffer).resize(width, height).toBuffer()
  }
}
