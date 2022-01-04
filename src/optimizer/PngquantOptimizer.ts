import * as PngQuant from 'pngquant'
import IOptimizer from '../Interface/IOptimizer'
import EnumOptimizeAlgo from '../Enum/EnumOptimizeAlgo'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'
import { Readable, Writable } from 'stream'
import * as stream from 'stream'
import { Buffer } from 'buffer'

class PngquantOptimizer implements IOptimizer {
  acceptAlgorithms: EnumOptimizeAlgo[] = [EnumPngOptimizeAlgo.pngquant]

  optimize(buffer: Buffer, algo: EnumOptimizeAlgo, quality: number): Promise<Buffer> {
    switch (algo) {
      case EnumPngOptimizeAlgo.pngquant: {
        const pngQuanter = new PngQuant([192, '--quality', quality, '--nofs', '-'])
        const readStream = Readable.from(buffer.toString())
        const distStream = new stream.Writable()
        const resBuffer = Buffer.from([])

        distStream.on('close', (data) => {
          console.log(data)
        })

        readStream.pipe(pngQuanter).pipe(distStream)
        return
      }
    }

    throw `Algo ${algo} is not supported in PngquantOptimizer`
  }
}

export default PngquantOptimizer
