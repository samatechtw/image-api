import { ILoader } from '../Interface/ILoader'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import * as sharp from 'sharp'

export class SharpLoader implements ILoader {
  readFormats: EnumFileFormat[] = [
    EnumFileFormat.jpeg,
    EnumFileFormat.png,
    EnumFileFormat.webp,
    EnumFileFormat.avif,
    EnumFileFormat.tiff,
    EnumFileFormat.gif,
    EnumFileFormat.svg,
  ]

  writeFormat: EnumFileFormat[] = [
    EnumFileFormat.jpeg,
    EnumFileFormat.png,
    EnumFileFormat.webp,
    EnumFileFormat.avif,
    EnumFileFormat.tiff,
  ]

  convert = async (buffer: Buffer, toFormat: EnumFileFormat): Promise<Buffer> => {
    switch (toFormat) {
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

  resize = async (buffer: Buffer, width: number, height: number): Promise<Buffer> => {
    return await sharp(buffer).resize(width, height).toBuffer()
  }
}
