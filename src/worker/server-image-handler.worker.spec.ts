import { pool } from 'workerpool'
import path from 'path'
import { readFile, unlink } from 'node:fs/promises'
import pathStore from '../store/path-store'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { FileFormat } from '../enum/file-format'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'

describe('server-image-handler.worker', () => {
  it('ping()', async () => {
    const workerPool = pool(pathStore.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const res = await workerPool.exec('ping', [])

    expect(res).toEqual('pong')
    await workerPool.terminate()
  })

  it('handlePath() resize', async () => {
    const workerPool = pool(pathStore.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpg')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256_48x48.jpg')
    const config: IServerImageHandlerConfig = {
      inputFormat: FileFormat.jpg,
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
    const workerPool = pool(pathStore.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256.png.jpg')
    const config: IServerImageHandlerConfig = {
      inputFormat: FileFormat.png,
      outputFormat: FileFormat.jpg,
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
    const workerPool = pool(pathStore.serverImageHandlerWorker, {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256.pngquant.png')
    const config: IServerImageHandlerConfig = {
      inputFormat: FileFormat.png,
      optimizeAlgo: OptimizationAlgorithm.pngquant,
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
