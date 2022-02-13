import { readFile } from 'fs/promises'
import { writeFile } from 'node:fs/promises'
import * as path from 'path'
import { SquooshOptimizer } from './squoosh-optimizer'
import pathStore from '../store/path-store'

describe('SquooshOptimizer', () => {
  let optimizer: SquooshOptimizer

  beforeEach(() => {
    optimizer = new SquooshOptimizer()
  })

  it('optimize()', async () => {
    for (const algo of optimizer.acceptAlgorithms) {
      const inBuffer = await readFile(
        path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'),
      )
      const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
      const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)
      const outBuffer10 = await optimizer.optimize(inBuffer, algo, 10)

      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${90}.jpeg`),
        outBuffer90,
      )
      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${50}.jpeg`),
        outBuffer50,
      )
      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}_${10}.jpeg`),
        outBuffer10,
      )

      expect(inBuffer.length > outBuffer90.length).toEqual(true)
      expect(outBuffer90.length > outBuffer50.length).toEqual(true)
      expect(outBuffer50.length > outBuffer10.length).toEqual(true)
    }
  })
})
