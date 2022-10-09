import * as _ from 'lodash'
import { IOptimizer, IProcessor, SquooshOptimizer } from '@samatech/image-api'
import { EnumFileFormat, EnumOptimizationAlgorithm } from '@samatech/image-api-types'

// import { ImageRsProcessor } from '../processor/image-rs-processor'

export class WebImageHandler {
  // sort by performance
  processors: IProcessor[] = []

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
