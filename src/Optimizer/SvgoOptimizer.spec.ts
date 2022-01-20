import SvgoOptimizer from './SvgoOptimizer'
import { readFile } from 'fs/promises'
import pathStore from '../../pathStore'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import path from 'path'
import { writeFile } from 'node:fs/promises'

describe('SvgoOptimizer', () => {
  it('constructor()', async () => {
    const optimizer = new SvgoOptimizer()

    expect(optimizer).toBeInstanceOf(SvgoOptimizer)
  })

  const optimizer = new SvgoOptimizer()

  for (let algo of optimizer.acceptAlgorithms) {
    it(`optimize() ${algo}`, async () => {
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
    })
  }
})
