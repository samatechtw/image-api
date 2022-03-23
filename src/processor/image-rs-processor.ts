import { IProcessor } from '../interface/i-processor'
import { EnumFileFormat } from '../enum/enum-file-format'
import envStore from '../store/env-store'

let wasm = null

if (envStore.isNode) {
  wasm = require('./image-rs-processor/pkg-node/image_rs_processor')
} else if (envStore.isWeb) {
  wasm = require('./image-rs-processor/pkg-web/image_rs_processor')
} else {
  throw 'Can not detect current env for WASM module.'
}

export class ImageRsProcessor implements IProcessor {
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
    return Buffer.from(wasm.convert(buffer, toFormat))
  }

  async resize(buffer: Buffer, width: number, height: number): Promise<Buffer> {
    return Buffer.from(wasm.resize(buffer, width, height))
  }
}
