import { pool } from 'workerpool'
import path from 'path'
import { readFile, unlink } from 'node:fs/promises'
import { pathUtil } from '../config'
import { IServerImageHandlerConfig } from '../interface'
import { EnumOptimizationAlgorithm, EnumFileFormat } from '../enum'

describe('server-image-handler.worker', () => {
  it('ping()', async () => {
    const workerPool = pool(pathUtil.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const res = await workerPool.exec('ping', [])

    expect(res).toEqual('pong')
    await workerPool.terminate()
  })

  it('handlePath() resize', async () => {
    const workerPool = pool(pathUtil.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathUtil.testAsset, 'wtm_256x256.jpg')
    const targetPath = path.resolve(pathUtil.testOut, 'wtm_256x256_48x48.jpg')
    const config: IServerImageHandlerConfig = {
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
    const workerPool = pool(pathUtil.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathUtil.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathUtil.testOut, 'wtm_256x256.png.jpg')
    const config: IServerImageHandlerConfig = {
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
    const workerPool = pool(pathUtil.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathUtil.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathUtil.testOut, 'wtm_256x256.pngquant.png')
    const config: IServerImageHandlerConfig = {
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
