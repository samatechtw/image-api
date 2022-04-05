import PngQuant from 'pngquant'
import { Readable } from 'stream'
import { Buffer } from 'buffer'
import { IOptimizer } from '../interface'
import { EnumOptimizationAlgorithm } from '../enum'

export class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[] = [EnumOptimizationAlgorithm.pngquant]

  optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.pngquant: {
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
