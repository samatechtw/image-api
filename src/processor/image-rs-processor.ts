import { IProcessor } from '../interface'
import { EnumFileFormat } from '../enum'
import { envUtil } from '../env'

export class ImageRsProcessor implements IProcessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasm: any

  constructor() {
    if (envUtil.isNode) {
      this.wasm = require('./image-rs-processor/pkg-node/image_rs_processor')
    } else if (envUtil.isWeb) {
      this.wasm = require('./image-rs-processor/pkg-web/image_rs_processor')
    } else {
      throw 'Can not detect current env for WASM module.'
    }
  }

  readFormats: EnumFileFormat[] = [
    EnumFileFormat.jpeg,
    EnumFileFormat.jpg,
    EnumFileFormat.png,
    EnumFileFormat.gif,
    EnumFileFormat.bmp,
    // An resize issue: 128x128 file size > 256x256 file size
    // EnumFileFormat.ico,
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
    return Buffer.from(this.wasm.convert(buffer, toFormat))
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return Buffer.from(this.wasm.resize(buffer, width, height))
  }
}
