import { readFile } from 'node:fs/promises'
import path from 'path'
import { EnumOptimizationAlgorithm } from '@samatech/image-api-types'
import { SharpOptimizer } from './sharp-optimizer'

jest.setTimeout(60000)

describe('SharpOptimizer', () => {
  let optimizer: SharpOptimizer
  let testAsset: string

  beforeEach(() => {
    optimizer = new SharpOptimizer()
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
  })

  const testOptimize = async (algo: EnumOptimizationAlgorithm, assetName: string) => {
    const inBuffer = await readFile(path.resolve(testAsset, assetName))

    const outBuffer90 = await optimizer.optimize(inBuffer, algo, 90)
    const outBuffer70 = await optimizer.optimize(inBuffer, algo, 70)
    const outBuffer50 = await optimizer.optimize(inBuffer, algo, 50)

    expect(inBuffer.length).toBeGreaterThanOrEqual(outBuffer90.length)
    expect(outBuffer90.length).toBeGreaterThanOrEqual(outBuffer70.length)
    expect(outBuffer70.length).toBeGreaterThanOrEqual(outBuffer50.length)
  }

  it('optimize()', async () => {
    await testOptimize(EnumOptimizationAlgorithm.mozjpeg, 'wtm_256x256.jpeg')
    await testOptimize(EnumOptimizationAlgorithm.jpegCompress, 'wtm_256x256.jpeg')
    await testOptimize(EnumOptimizationAlgorithm.pngCompress, 'wtm_256x256.png')
    await testOptimize(EnumOptimizationAlgorithm.webpCompress, 'wtm_256x256.webp')
    await testOptimize(EnumOptimizationAlgorithm.tiffCompress, 'wtm_256x256.tiff')
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
