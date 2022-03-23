import { cpus, pool, WorkerPool } from 'workerpool'
import { ServerImageHandler } from '../handler/server-image-handler'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import pathStore from '../store/path-store'
import envStore from '../store/env-store'

export class WorkerService {
  workerPool: WorkerPool = null

  ping = async (): Promise<string> => {
    const handler = new ServerImageHandler()
    const resBuffer = await this.workerPool.exec(handler.ping, [])

    return resBuffer
  }

  handlePath = async (
    inputPath: string,
    outputPath: string,
    config: IServerImageHandlerConfig,
  ) => {
    await this.workerPool.exec('handlePath', [inputPath, outputPath, config])
  }

  close = async () => {
    if (this.workerPool) {
      await this.workerPool.terminate(true)
    }
  }

  init = async () => {
    if (this.workerPool) {
      await this.workerPool.terminate(true)
    }

    this.workerPool = pool(pathStore.serverImageHandlerWorker, {
      minWorkers: 'max',
      maxWorkers: envStore.workerCount,
      workerType: 'process',
    })
  }
}

export default new WorkerService()
