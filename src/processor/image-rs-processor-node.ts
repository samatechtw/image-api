import { ImageRsProcessor } from './image-rs-processor'

export class ImageRsProcessorNode extends ImageRsProcessor {
  constructor() {
    const wasm = require('./image-rs-processor/pkg-node/image_rs_processor')
    super(wasm)
  }
}
