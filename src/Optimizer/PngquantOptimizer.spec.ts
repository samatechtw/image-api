import PngquantOptimizer from './PngquantOptimizer'
import { readFile } from 'fs/promises'
import pathStore from '../store/pathStore'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import * as path from 'path'
import { writeFile } from 'node:fs/promises'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'

describe('PngquantOptimizer', () => {
  it('constructor()', async () => {
    const optimizer = new PngquantOptimizer()

    expect(optimizer).toBeInstanceOf(PngquantOptimizer)
  })

  const optimizer = new PngquantOptimizer()

  for (let algo of optimizer.acceptAlgorithms) {
    it(`optimize() ${algo}`, async () => {
      const inBuffer = await readFile(
        path.resolve(pathStore.testAsset, 'wtm_256x256.png'),
      )
      const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
      const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)
      const outBuffer10 = await optimizer.optimize(inBuffer, algo, 10)

      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${90}.png`),
        outBuffer90,
      )
      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${50}.png`),
        outBuffer50,
      )
      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${10}.png`),
        outBuffer10,
      )

      expect(inBuffer.length > outBuffer90.length).toEqual(true)
      expect(outBuffer90.length > outBuffer50.length).toEqual(true)
      expect(outBuffer50.length > outBuffer10.length).toEqual(true)
    })
  }
})
