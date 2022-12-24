import * as path from 'path'
import { readFile } from 'fs/promises'
import { writeFile } from 'node:fs/promises'
import { SquooshOptimizer } from './squoosh-optimizer'

describe('SquooshOptimizer', () => {
  let optimizer: SquooshOptimizer
  let testAsset: string
  let testOut: string

  beforeEach(() => {
    optimizer = new SquooshOptimizer()
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    testOut = path.resolve(__dirname, '../../test/out')
  })

  it('optimize()', async () => {
    for (const algo of optimizer.acceptAlgorithms) {
      const inBuffer = await readFile(path.resolve(testAsset, 'wtm_256x256.jpeg'))
      const outBuffer90 = await optimizer.optimize(inBuffer, algo, 80)
      const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)
      const outBuffer10 = await optimizer.optimize(inBuffer, algo, 10)

      await writeFile(
        path.resolve(testOut, `wtm_256x256_${algo}_${80}.jpeg`),
        outBuffer90,
      )
      await writeFile(
        path.resolve(testOut, `wtm_256x256_${algo}_${50}.jpeg`),
        outBuffer50,
      )
      await writeFile(
        path.resolve(testOut, `wtm_256x256_${algo}_${10}.jpeg`),
        outBuffer10,
      )

      expect(inBuffer.length).toBeGreaterThan(outBuffer90.length)
      expect(outBuffer90.length).toBeGreaterThan(outBuffer50.length)
      expect(outBuffer50.length).toBeGreaterThan(outBuffer10.length)
    }
  })
})
