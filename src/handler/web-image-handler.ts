import { IProcessor } from '../interface/i-processor'
import { IOptimizer } from '../interface/i-optimizer'
import { SquooshOptimizer } from '../optimizer/squoosh-optimizer'
import { EnumFileFormat } from '../enum/enum-file-format'
import * as _ from 'lodash'
import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'
import { ImageRsProcessor } from '../processor/image-rs-processor'

export class WebImageHandler {
  // sort by performance
  processors: IProcessor[] = [new ImageRsProcessor()]

  // sort by performance
  optimizers: IOptimizer[] = [new SquooshOptimizer()]

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
}
