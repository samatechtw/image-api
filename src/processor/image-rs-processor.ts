import { IProcessor } from '../interface/i-processor'
import { EnumFileFormat } from '../enum/enum-file-format'
import { convert } from './image-rs-processor/pkg/image_rs_processor'

export class ImageRsProcessor implements IProcessor {
  readFormats: EnumFileFormat[] = [
    EnumFileFormat.jpeg,
    EnumFileFormat.jpg,
    EnumFileFormat.png,
    EnumFileFormat.gif,
    EnumFileFormat.bmp,
    EnumFileFormat.ico,
  ]

  writeFormats: EnumFileFormat[] = [
    EnumFileFormat.jpeg,
    EnumFileFormat.jpg,
    EnumFileFormat.png,
    EnumFileFormat.gif,
    EnumFileFormat.bmp,
    EnumFileFormat.ico,
  ]

  async convert(buffer: Buffer, toFormat: EnumFileFormat): Promise<Buffer> {
    return await convert(buffer, toFormat) as any
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return Promise.resolve(undefined)
  }
}
