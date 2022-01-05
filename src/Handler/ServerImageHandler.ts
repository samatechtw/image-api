import { IProcessor } from '../Interface/IProcessor'
import { SharpProcessor } from '../Processor/SharpProcessor'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import * as _ from 'lodash'
import { Buffer } from 'buffer'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import IOptimizer from '../Interface/IOptimizer'
import SquooshOptimizer from '../Optimizer/SquooshOptimizer'
import PngquantOptimizer from '../Optimizer/PngquantOptimizer'
import SvgoOptimizer from '../Optimizer/SvgoOptimizer'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'

class ServerImageHandler {
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

    for (let processor of this.processors) {
      res = [...res, ...processor.readFormats]
    }

    return _.uniq(res)
  }

  get writeFormats(): EnumFileFormat[] {
    let res = []

    for (let processor of this.processors) {
      res = [...res, ...processor.writeFormats]
    }

    return _.uniq(res)
  }

  get acceptOptimizeAlgorithms(): EnumOptimizeAlgo[] {
    let res = []

    for (let optimizer of this.optimizers) {
      res = [...res, ...optimizer.acceptAlgorithms]
    }

    return _.uniq(res)
  }

  async handle(buffer: Buffer, config: IServerImageHandlerConfig): Promise<Buffer> {
    // check format
    if (this.readFormats.indexOf(config.inputFormat) === -1) {
      throw `Input format ${config.inputFormat} is not supported`
    }

    if (this.writeFormats.indexOf(config.outputFormat) === -1) {
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
    if (
      config.inputFormat &&
      config.outputFormat &&
      config.inputFormat !== config.outputFormat
    ) {
      for (const processor of this.processors) {
        if (
          processor.readFormats.indexOf(config.inputFormat) > -1 &&
          processor.writeFormats.indexOf(config.outputFormat) > -1
        ) {
          resBuffer = await processor.convert(resBuffer, config.outputFormat)
          break
        }
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

    return resBuffer
  }
}

export default ServerImageHandler
