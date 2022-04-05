import * as path from 'path'
import { readFile } from 'fs/promises'
import { writeFile } from 'node:fs/promises'
import { pathUtil } from '../config'
import { PngquantOptimizer } from './pngquant-optimizer'

describe('PngquantOptimizer', () => {
  let optimizer: PngquantOptimizer

  beforeEach(() => {
    optimizer = new PngquantOptimizer()
  })

  it('optimize()', async () => {
    for (const algo of optimizer.acceptAlgorithms) {
      const inBuffer = await readFile(path.resolve(pathUtil.testAsset, 'wtm_256x256.png'))
      const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
      const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)
      const outBuffer10 = await optimizer.optimize(inBuffer, algo, 10)

      await writeFile(
        path.resolve(pathUtil.testOut, `wtm_256x256_${algo}_${90}.png`),
        outBuffer90,
      )
      await writeFile(
        path.resolve(pathUtil.testOut, `wtm_256x256_${algo}_${50}.png`),
        outBuffer50,
      )
      await writeFile(
        path.resolve(pathUtil.testOut, `wtm_256x256_${algo}_${10}.png`),
        outBuffer10,
      )

      expect(inBuffer.length > outBuffer90.length).toEqual(true)
      expect(outBuffer90.length > outBuffer50.length).toEqual(true)
      expect(outBuffer50.length > outBuffer10.length).toEqual(true)
    }
  })
})
