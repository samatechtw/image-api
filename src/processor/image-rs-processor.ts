import { IProcessor } from '../interface'
import { EnumFileFormat } from '../enum'

export class ImageRsProcessor implements IProcessor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wasm: any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(wasm: any) {
    this.wasm = wasm
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

  async convert(buffer: Uint8Array, toFormat: EnumFileFormat): Promise<Uint8Array> {
    return new Uint8Array(this.wasm.convert(buffer, toFormat))
  }

  async resize(buffer: Uint8Array, width: number, height: number): Promise<Uint8Array> {
    return new Uint8Array(this.wasm.resize(buffer, width, height))
  }
}
