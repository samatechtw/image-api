import PngQuant from 'pngquant'
import { IOptimizer } from '../interface/i-optimizer'
import { OptimizeAlgo } from '../enum/optimize-algo'
import { PngOptimizeAlgo } from '../enum/png-optimize-algo'
import { Readable } from 'stream'
import { Buffer } from 'buffer'

export class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: OptimizeAlgo[] = [PngOptimizeAlgo.pngquant]

  optimize(buffer: Buffer, algo: OptimizeAlgo, quality: number): Promise<Buffer> {
    switch (algo) {
      case PngOptimizeAlgo.pngquant: {
        const pngQuanter = new PngQuant([256, '--quality', quality, '--nofs', '-'])
        const stream: Readable = Readable.from(buffer).pipe(pngQuanter)
        let chunks = []

        return new Promise<Buffer>((resolve, reject) => {
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
