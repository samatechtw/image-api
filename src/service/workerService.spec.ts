import workerService, { WorkerService } from './workerService'
import path from 'path'
import pathStore from '../../pathStore'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import { EnumFileFormat } from '../Enum/EnumFileFormat'
import ServerImageHandler from '../Handler/ServerImageHandler'
import { readFile, unlink } from 'node:fs/promises'
import EnumJpegOptimizeAlgo from '../Enum/EnumJpegOpitmizeAlgo'
import EnumPngOptimizeAlgo from '../Enum/EnumPngOptimizeAlgo'

describe('workerService', () => {
  it('constructor()', async () => {
    expect(workerService).toBeInstanceOf(WorkerService)
  })

  it('ping() single', async () => {
    const res = await workerService.ping()

    expect(res).toEqual('pong')
  })

  it('ping() multiple', async () => {
    const [res1, res2, res3, res4] = await Promise.all([
      workerService.ping(),
      workerService.ping(),
      workerService.ping(),
      workerService.ping(),
    ])

    expect(res1).toEqual('pong')
    expect(res2).toEqual('pong')
    expect(res3).toEqual('pong')
    expect(res4).toEqual('pong')
  })

  it('handlePath() single', async () => {
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg')
    const config: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      outputFormat: EnumFileFormat.png,
      width: 48,
      height: 48,
      optimizeAlgo: EnumPngOptimizeAlgo.pngquant,
      quality: 90,
    }
    const resPath = await workerService.handlePath(sourcePath, config)
    const handler = new ServerImageHandler()
    const expectResPath = await handler.handlePath(sourcePath, config)

    const resBuffer = await readFile(resPath)
    const expectResBuffer = await readFile(expectResPath)

    await unlink(resPath)
    await unlink(expectResPath)

    expect(resBuffer).toEqual(expectResBuffer)
  })

  it('handlePath() multiple', async () => {
    const sourcePath = path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg')
    const config1: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      width: 48,
      height: 48,
    }
    const config2: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      outputFormat: EnumFileFormat.png,
    }
    const config3: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      optimizeAlgo: EnumJpegOptimizeAlgo.mozjpeg,
      quality: 90,
    }
    const config4: IServerImageHandlerConfig = {
      inputFormat: EnumFileFormat.jpeg,
      outputFormat: EnumFileFormat.png,
      width: 48,
      height: 48,
      optimizeAlgo: EnumPngOptimizeAlgo.pngquant,
      quality: 90,
    }

    const [resPath1, resPath2, resPath3, resPath4] = await Promise.all([
      workerService.handlePath(sourcePath, config1),
      workerService.handlePath(sourcePath, config2),
      workerService.handlePath(sourcePath, config3),
      workerService.handlePath(sourcePath, config4),
    ])

    const resBuffer1 = await readFile(resPath1)
    const resBuffer2 = await readFile(resPath2)
    const resBuffer3 = await readFile(resPath3)
    const resBuffer4 = await readFile(resPath4)

    const handler = new ServerImageHandler()
    const expectResPath1 = await handler.handlePath(sourcePath, config1)
    const expectResPath2 = await handler.handlePath(sourcePath, config2)
    const expectResPath3 = await handler.handlePath(sourcePath, config3)
    const expectResPath4 = await handler.handlePath(sourcePath, config4)

    const expectResBuffer1 = await readFile(expectResPath1)
    const expectResBuffer2 = await readFile(expectResPath2)
    const expectResBuffer3 = await readFile(expectResPath3)
    const expectResBuffer4 = await readFile(expectResPath4)

    await unlink(resPath1)
    await unlink(resPath2)
    await unlink(resPath3)
    await unlink(resPath4)
    await unlink(expectResPath1)
    await unlink(expectResPath2)
    await unlink(expectResPath3)
    await unlink(expectResPath4)

    expect(resBuffer1).toEqual(expectResBuffer1)
    expect(resBuffer2).toEqual(expectResBuffer2)
    expect(resBuffer3).toEqual(expectResBuffer3)
    expect(resBuffer4).toEqual(expectResBuffer4)
  })
})
