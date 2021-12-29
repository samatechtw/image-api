import { readFile } from 'fs/promises'
import JpegOptimizer from './JpegOptimizer'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import pathStore from '../../pathStore'
import * as path from 'path'

describe('JpegOptimizer', () => {
  it('constructor()', async () => {
    const optimizer = new JpegOptimizer()

    expect(optimizer).toBeInstanceOf(JpegOptimizer)
  })

  const optimizer = new JpegOptimizer()

  for (let algo in EnumJpegOptimizeAlgo) {
    it(`optimize() ${algo}`, async () => {
      const inBuffer = await readFile(
        path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'),
      )
      const outBuffer100 = await optimizer.optimize(
        inBuffer,
        algo as EnumJpegOptimizeAlgo,
        100,
      )
      const outBuffer50 = await optimizer.optimize(
        inBuffer,
        algo as EnumJpegOptimizeAlgo,
        50,
      )
      const outBuffer10 = await optimizer.optimize(
        inBuffer,
        algo as EnumJpegOptimizeAlgo,
        10,
      )

      expect(inBuffer.length > outBuffer100.length).toEqual(true)
      expect(outBuffer100.length > outBuffer50.length).toEqual(true)
      expect(outBuffer50.length > outBuffer10.length).toEqual(true)
    })
  }
})
