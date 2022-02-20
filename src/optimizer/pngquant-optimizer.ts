import PngQuant from 'pngquant'
import { IOptimizer } from '../interface/i-optimizer'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'
import { Readable } from 'stream'
import { Buffer } from 'buffer'

export class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizationAlgorithm[] = [OptimizationAlgorithm.pngquant]

  optimize(
    buffer: Buffer,
    algo: OptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case OptimizationAlgorithm.pngquant: {
        const pngQuanter = new PngQuant([256, '--quality', quality, '--nofs', '-'])
        const stream: Readable = Readable.from(buffer).pipe(pngQuanter)
        let chunks = []

        return new Promise<Buffer>((resolve, _reject) => {
          stream.on('data', (data) => {
            chunks = [...chunks, ...data]
          })
          stream.on('end', () => {
            resolve(Buffer.from(chunks))
          })
        })
      }
    }

    throw `Algo ${algo} is not supported in PngquantOptimizer`
  }
}
