import {
  EnumFileFormat,
  EnumOptimizationAlgorithm,
  IImageJobConfig,
} from '@samatech/image-api-types'
import { IOptimizer, IProcessor } from '../interface'
import { ImageRsProcessor } from '../processor/image-rs-processor'
import imageRsProcessorWasmInit from '../processor/image-rs-processor/pkg-web/image_rs_processor'

export class WebImageHandler {
  // sort by performance
  processors: IProcessor[]

  // sort by performance
  optimizers: IOptimizer[] = []

  async init() {
    this.processors = [new ImageRsProcessor(await imageRsProcessorWasmInit())]
  }

  get readFormats(): EnumFileFormat[] {
    const res = new Set<EnumFileFormat>()

    for (const processor of this.processors) {
      for (const format of processor.readFormats) {
        res.add(format)
      }
    }
    return [...res.values()]
  }

  get writeFormats(): EnumFileFormat[] {
    const res = new Set<EnumFileFormat>()

    for (const processor of this.processors) {
      for (const format of processor.writeFormats) {
        res.add(format)
      }
    }
    return [...res.values()]
  }

  get acceptOptimizeAlgorithms(): EnumOptimizationAlgorithm[] {
    const res = new Set<EnumOptimizationAlgorithm>()

    for (const optimizer of this.optimizers) {
      for (const algo of optimizer.acceptAlgorithms) {
        res.add(algo)
      }
    }
    return [...res.values()]
  }

  async handleBuffer(buffer: Uint8Array, config: IImageJobConfig): Promise<Uint8Array> {
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
