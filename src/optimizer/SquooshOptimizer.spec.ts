import { readFile } from 'fs/promises'
import SquooshOptimizer from './SquooshOptimizer'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import pathStore from '../../pathStore'
import * as path from 'path'

describe('SquooshOptimizer', () => {
  it('constructor()', async () => {
    const optimizer = new SquooshOptimizer()

    expect(optimizer).toBeInstanceOf(SquooshOptimizer)
  })

  const optimizer = new SquooshOptimizer()

  for (let algo of optimizer.acceptAlgorithms) {
    it(`optimize() ${algo}`, async () => {
      const inBuffer = await readFile(
        path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'),
      )
      const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
      const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)
      const outBuffer10 = await optimizer.optimize(inBuffer, algo, 10)

      expect(inBuffer.length > outBuffer90.length).toEqual(true)
      expect(outBuffer90.length > outBuffer50.length).toEqual(true)
      expect(outBuffer50.length > outBuffer10.length).toEqual(true)
    })
  }
})
