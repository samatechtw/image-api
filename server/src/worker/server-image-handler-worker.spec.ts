import { readFile, unlink } from 'node:fs/promises'
import path from 'path'
import { pool } from 'workerpool'
import {
  EnumFileFormat,
  EnumOptimizationAlgorithm,
  IImageJobConfig,
} from '@samatech/image-api-types'

describe('server-image-handler.worker', () => {
  let testAsset: string
  let testOut: string
  let workerPath: string

  beforeEach(() => {
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    testOut = path.resolve(__dirname, '../../test/out')
    workerPath = path.resolve(
      __dirname,
      '../../dist/src/worker/server-image-handler-worker.js',
    )
  })

  it('ping()', async () => {
    const workerPool = pool(workerPath, {
      workerType: 'process',
    })
    const res = await workerPool.exec('ping', [])

    expect(res).toEqual('pong')
    await workerPool.terminate()
  })

  it('handlePath() resize', async () => {
    const workerPool = pool(workerPath, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(testAsset, 'wtm_256x256.jpg')
    const targetPath = path.resolve(testOut, 'wtm_256x256_48x48.jpg')
    const config: IImageJobConfig = {
      inputFormat: EnumFileFormat.jpg,
      width: 48,
      height: 48,
    }

    await workerPool.exec('handlePath', [sourcePath, targetPath, config])
    const sourceBuffer = await readFile(sourcePath)
    const targetBuffer = await readFile(targetPath)
    await unlink(targetPath)

    expect(targetBuffer.length > 0).toEqual(true)
    expect(targetBuffer.length < sourceBuffer.length).toEqual(true)

    await workerPool.terminate()
  })

  it('handle() convert', async () => {
    const workerPool = pool(workerPath, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(testOut, 'wtm_256x256.png.jpg')
    const config: IImageJobConfig = {
      inputFormat: EnumFileFormat.png,
      outputFormat: EnumFileFormat.jpg,
    }

    await workerPool.exec('handlePath', [sourcePath, targetPath, config])
    const sourceBuffer = await readFile(sourcePath)
    const targetBuffer = await readFile(targetPath)
    await unlink(targetPath)

    expect(targetBuffer.length > 0).toEqual(true)
    expect(targetBuffer.length < sourceBuffer.length).toEqual(true)

    await workerPool.terminate()
  })

  it('handle() optimize', async () => {
    const workerPool = pool(workerPath, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(testOut, 'wtm_256x256.pngquant.png')
    const config: IImageJobConfig = {
      inputFormat: EnumFileFormat.png,
      optimizeAlgo: EnumOptimizationAlgorithm.pngquant,
      quality: 90,
    }

    await workerPool.exec('handlePath', [sourcePath, targetPath, config])
    const sourceBuffer = await readFile(sourcePath)
    const targetBuffer = await readFile(targetPath)
    await unlink(targetPath)

    expect(targetBuffer.length > 0).toEqual(true)
    expect(targetBuffer.length < sourceBuffer.length).toEqual(true)

    await workerPool.terminate()
  })
})
