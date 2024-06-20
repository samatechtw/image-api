import { Buffer } from 'buffer'
import PngQuant from 'pngquant'
import { Readable } from 'stream'
import { EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import { IOptimizer } from '../interface'

export class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizationAlgorithm[] = [EnumOptimizationAlgorithm.pngquant]

  optimize(
    buffer: Buffer,
    algo: EnumOptimizationAlgorithm,
    quality: number,
  ): Promise<Buffer> {
    switch (algo) {
      case EnumOptimizationAlgorithm.pngquant: {
        const pngQuant = new PngQuant([
          '256',
          '--quality',
          quality.toString(),
          '--nofs',
          '-',
        ])
        const stream: Readable = Readable.from(buffer).pipe(pngQuant as any)
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
