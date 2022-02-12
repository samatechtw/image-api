import { readFile } from 'fs/promises'
import { writeFile } from 'node:fs/promises'
import * as path from 'path'
import pathStore from '../store/path-store'
import { SvgoOptimizer } from './svgo-optimizer'

describe('SvgoOptimizer', () => {
  let optimizer: SvgoOptimizer

  beforeEach(() => {
    optimizer = new SvgoOptimizer()
  })

  it('optimize()', async () => {
    for (const algo of optimizer.acceptAlgorithms) {
      const inBuffer = await readFile(
        path.resolve(pathStore.testAsset, 'wtm_256x256.svg'),
      )

      // quality option is no use in svgo
      const outBuffer = await optimizer.optimize(inBuffer, algo, 90)

      await writeFile(
        path.resolve(pathStore.testOut, `wtm_256x256_${algo}.svg`),
        outBuffer,
      )

      expect(inBuffer.length > outBuffer.length).toEqual(true)
    }
  })
})
