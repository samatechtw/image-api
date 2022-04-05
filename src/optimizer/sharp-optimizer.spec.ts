import path from 'path'
import { readFile } from 'node:fs/promises'
import { SharpOptimizer } from './sharp-optimizer'
import { pathUtil } from '../config'
import { EnumOptimizationAlgorithm } from '../enum'

describe('SharpOptimizer', () => {
  jest.setTimeout(60 * 1000 * 1000)
  let optimizer: SharpOptimizer

  beforeEach(() => {
    optimizer = new SharpOptimizer()
  })

  const testOptimize = async (
    algo: EnumOptimizationAlgorithm,
    assetName: string,
    isOptimizer: boolean,
  ) => {
    const inBuffer = await readFile(path.resolve(pathUtil.testAsset, assetName))

    if (isOptimizer) {
      const outBuffer100 = await optimizer.optimize(inBuffer, algo, 100)

      expect(inBuffer.length > outBuffer100.length).toEqual(true)
    }

    const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
    const outBuffer70 = await optimizer.optimize(inBuffer, algo, 70)
    const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)

    expect(inBuffer.length).toBeGreaterThanOrEqual(outBuffer90.length)
    expect(outBuffer90.length).toBeGreaterThanOrEqual(outBuffer70.length)
    expect(outBuffer70.length).toBeGreaterThanOrEqual(outBuffer50.length)
  }

  it('optimize()', async () => {
    await testOptimize(EnumOptimizationAlgorithm.mozjpeg, 'wtm_256x256.jpeg', true)
    await testOptimize(EnumOptimizationAlgorithm.jpegCompress, 'wtm_256x256.jpeg', false)
    await testOptimize(EnumOptimizationAlgorithm.pngCompress, 'wtm_256x256.png', false)
    await testOptimize(EnumOptimizationAlgorithm.webpCompress, 'wtm_256x256.webp', false)
    await testOptimize(EnumOptimizationAlgorithm.tiffCompress, 'wtm_256x256.tiff', false)
    // todo: add heif sample file
    /*await testOptimize(
      EnumOptimizationAlgorithm.heifCompress,
      'wtm_256x256.heif',
      false,
    )*/
    // fixme: avif file size increase after compress...?
    /*await testOptimize(
      EnumOptimizationAlgorithm.avifCompress,
      'wtm_256x256.avif',
      false,
    )*/
  })
})
