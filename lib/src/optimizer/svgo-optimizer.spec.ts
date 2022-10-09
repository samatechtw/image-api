import * as path from 'path'
import { readFile } from 'fs/promises'
import { writeFile } from 'node:fs/promises'
import { SvgoOptimizer } from './svgo-optimizer'

describe('SvgoOptimizer', () => {
  let optimizer: SvgoOptimizer
  let testAsset: string
  let testOut: string

  beforeEach(() => {
    optimizer = new SvgoOptimizer()
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    testOut = path.resolve(__dirname, '../../test/out')
  })

  it('optimize()', async () => {
    for (const algo of optimizer.acceptAlgorithms) {
      const inBuffer = await readFile(path.resolve(testAsset, 'wtm_256x256.svg'))

      // quality option is no use in svgo
      const outBuffer = await optimizer.optimize(inBuffer, algo, 90)

      await writeFile(path.resolve(testOut, `wtm_256x256_${algo}.svg`), outBuffer)

      expect(inBuffer.length > outBuffer.length).toEqual(true)
    }
  })
})
