import PngQuant from 'pngquant'
import IOptimizer from '../Interface/IOptimizer'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'
import { Readable, Writable } from 'stream'
import { Buffer } from 'buffer'

class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizeAlgo[] = [EnumPngOptimizeAlgo.pngquant]

  optimize(buffer: Buffer, algo: EnumOptimizeAlgo, quality: number): Promise<Buffer> {
    switch (algo) {
      case EnumPngOptimizeAlgo.pngquant: {
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

export default PngquantOptimizer
