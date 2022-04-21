import * as _ from 'lodash'
import { IProcessor, IOptimizer } from '../interface'
import { EnumOptimizationAlgorithm, EnumFileFormat } from '../enum'
import { ImageRsProcessor } from '../processor/image-rs-processor'
import { IWebImageHandlerConfig } from '../interface/i-web-image-handler-config'

import imageRsProcessorWasmInit from '../processor/image-rs-processor/pkg-web/image_rs_processor'
const imageRsProcessorWasm = await imageRsProcessorWasmInit()

console.log(imageRsProcessorWasmInit, imageRsProcessorWasm)

export class WebImageHandler {
  // sort by performance
  processors: IProcessor[] = [new ImageRsProcessor(imageRsProcessorWasm)]

  // sort by performance
  optimizers: IOptimizer[] = []

  get readFormats(): EnumFileFormat[] {
    let res = []

    for (const processor of this.processors) {
      res = [...res, ...processor.readFormats]
    }

    return _.uniq(res)
  }

  get writeFormats(): EnumFileFormat[] {
    let res = []

    for (const processor of this.processors) {
      res = [...res, ...processor.writeFormats]
    }

    return _.uniq(res)
  }

  get acceptOptimizeAlgorithms(): EnumOptimizationAlgorithm[] {
    let res = []

    for (const optimizer of this.optimizers) {
      res = [...res, ...optimizer.acceptAlgorithms]
    }

    return _.uniq(res)
  }

  async handleBuffer(
    buffer: Uint8Array,
    config: IWebImageHandlerConfig,
  ): Promise<Uint8Array> {
    // check format
    if (this.readFormats.indexOf(config.inputFormat) === -1) {
      throw `Input format ${config.inputFormat} is not supported`
    }

    if (config.outputFormat && this.writeFormats.indexOf(config.outputFormat) === -1) {
      throw `Output format ${config.outputFormat} is not supported`
    }

    // check algo
    if (
      config.optimizeAlgo &&
      this.acceptOptimizeAlgorithms.indexOf(config.optimizeAlgo) === -1
    ) {
      throw `Algorithm ${config.optimizeAlgo} is not supported`
    }

    let resBuffer = buffer

    // do resize first
    if (config.width && config.height) {
      for (const processor of this.processors) {
        if (processor.readFormats.indexOf(config.inputFormat) > -1) {
          resBuffer = await processor.resize(resBuffer, config.width, config.height)
          break
        }
      }
    }

    // then convert
    if (config.outputFormat && config.inputFormat !== config.outputFormat) {
      let hasMatchedProcessor = false

      for (const processor of this.processors) {
        if (
          processor.readFormats.indexOf(config.inputFormat) > -1 &&
          processor.writeFormats.indexOf(config.outputFormat) > -1
        ) {
          hasMatchedProcessor = true
          resBuffer = await processor.convert(resBuffer, config.outputFormat)
          break
        }
      }

      if (!hasMatchedProcessor) {
        throw `Can't convert ${config.inputFormat} to ${config.outputFormat}: no matched processor.`
      }
    }

    // then optimize
    if (config.optimizeAlgo && config.quality) {
      for (const optimizer of this.optimizers) {
        if (optimizer.acceptAlgorithms.indexOf(config.optimizeAlgo) > -1) {
          resBuffer = await optimizer.optimize(
            resBuffer,
            config.optimizeAlgo,
            config.quality,
          )
          break
        }
      }
    }

    // convert to buffer type again because some optimizers output uint8array
    return Buffer.from(resBuffer)
  }
}
