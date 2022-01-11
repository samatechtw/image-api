import { pool } from 'workerpool'
import path from 'path'
import pathStore from '../../pathStore'
import { readFile, unlink } from 'node:fs/promises'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import ServerImageHandler from '../Handler/ServerImageHandler'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'

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
    const sourceBuffer = await readFile(sourcePath)
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      width: 48,
      height: 48,
    }
    const resPath = await workerPool.exec('handlePath', [sourcePath, config])
    const resBuffer = await readFile(resPath)
    await unlink(resPath)
    const handler = new ServerImageHandler()
    const expectRes = await handler.handle(sourceBuffer, config)

    expect(resBuffer).toEqual(expectRes)
  })

  it('handle() convert', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpg')
    const sourceBuffer = await readFile(sourcePath)
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      outputFormat: EnumFileFormat.png,
    }
    const resPath = await workerPool.exec('handlePath', [sourcePath, config])
    const resBuffer = await readFile(resPath)
    await unlink(resPath)
    const handler = new ServerImageHandler()
    const expectRes = await handler.handle(sourceBuffer, config)

    expect(resBuffer).toEqual(expectRes)
  })

  it('handle() optimize', async () => {
    const workerPool = pool(path.resolve(pathStore.dist, 'serverImageHandlerWorker.js'), {
      workerType: 'process',
    })
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpg')
    const sourceBuffer = await readFile(sourcePath)
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpg,
      optimizeAlgo: EnumJpegOptimizeAlgo.mozjpeg,
      quality: 90,
    }
    const resPath = await workerPool.exec('handlePath', [sourcePath, config])
    const resBuffer = await readFile(resPath)
    await unlink(resPath)
    const handler = new ServerImageHandler()
    const expectRes = await handler.handle(sourceBuffer, config)

    expect(resBuffer).toEqual(expectRes)
  })
})
