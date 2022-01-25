import { pool } from 'workerpool'
import path from 'path'
import pathStore from '../store/pathStore'
import { readFile, unlink } from 'node:fs/promises'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import EnumFileFormat from '../Enum/EnumFileFormat'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'

describe('serverImageHandlerWorker', () => {
  it('ping()', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const res = await workerPool.exec('ping', [])

    expect(res).toEqual('pong')
  })

  it('handlePath() resize', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpg')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256_48x48.jpg')
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
  })

  it('handle() convert', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256.png.jpg')
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
  })

  it('handle() optimize', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.png')
    const targetPath = path.resolve(pathStore.testOut, 'wtm_256x256.pngquant.png')
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.png,
      optimizeAlgo: EnumPngOptimizeAlgo.pngquant,
      quality: 90,
    }

    await workerPool.exec('handlePath', [sourcePath, targetPath, config])
    const sourceBuffer = await readFile(sourcePath)
    const targetBuffer = await readFile(targetPath)
    await unlink(targetPath)

    expect(targetBuffer.length > 0).toEqual(true)
    expect(targetBuffer.length < sourceBuffer.length).toEqual(true)
  })
})
