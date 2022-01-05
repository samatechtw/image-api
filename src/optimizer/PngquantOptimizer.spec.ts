import PngquantOptimizer from './PngquantOptimizer'
import { readFile } from 'fs/promises'
import pathStore from '../../pathStore'
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
      const outBuffer = await optimizer.optimize(inBuffer, algo, 90)

      expect(inBuffer.length > outBuffer.length).toEqual(true)
    })
  }
})
