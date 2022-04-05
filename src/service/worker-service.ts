import { pool, WorkerPool, cpus } from 'workerpool'
import { ServerImageHandler } from '../handler'
import { IServerImageHandlerConfig } from '../interface'
import { pathUtil } from '../config'

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

    this.workerPool = pool(pathUtil.serverImageHandlerWorker, {
      minWorkers: 'max',
      maxWorkers: cpus,
      workerType: 'process',
    })
  }
}

export const workerService = new WorkerService()
