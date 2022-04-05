import fs from 'fs-extra'
import * as _ from 'lodash'
import { Buffer } from 'buffer'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { IOptimizer } from '../interface/i-optimizer'
import { SquooshOptimizer, PngquantOptimizer, SvgoOptimizer } from '../optimizer'
import { EnumFileFormat, EnumOptimizationAlgorithm } from '../enum'
import { IProcessor } from '../interface/'
import { SharpProcessor } from '../processor/sharp-processor'

export class ServerImageHandler {
  // sort by performance
  processors: IProcessor[] = [new SharpProcessor()]

  // sort by performance
  optimizers: IOptimizer[] = [
    new SquooshOptimizer(),
    new PngquantOptimizer(),
    new SvgoOptimizer(),
  ]

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

  handleBuffer = async (
    buffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<Buffer> => {
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

  // for worker
  handlePath = async (
    inputPath: string,
    outputPath: string,
    config: IServerImageHandlerConfig,
  ) => {
    try {
      const inputBuffer = await fs.readFile(inputPath)
      const outputBuffer = await this.handleBuffer(inputBuffer, config)

      await fs.outputFile(outputPath, outputBuffer)
    } catch (e) {
      console.log('ServerImageHandler.handlePath error:', e)
    }
  }

  // for test
  ping = () => {
    return 'pong'
  }
}
