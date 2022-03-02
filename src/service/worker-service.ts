import { cpus, pool, WorkerPool } from 'workerpool'
import { ServerImageHandler } from '../handler/server-image-handler'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import pathStore from '../store/path-store'

export class WorkerService {
  workerPool: WorkerPool

  init() {
    const workerPath = pathStore.serverImageHandlerWorker

    this.workerPool = pool(workerPath, {
      minWorkers: 'max',
      maxWorkers: cpus,
      workerType: 'process',
    })
  }

  async ping(): Promise<string> {
    const handler = new ServerImageHandler()
    const resBuffer = await this.workerPool.exec(handler.ping, [])

    return resBuffer
  }

  async handlePath(
    inputPath: string,
    outputPath: string,
    config: IServerImageHandlerConfig,
  ) {
    await this.workerPool.exec('handlePath', [inputPath, outputPath, config])
  }

  async close() {
    if (this.workerPool) {
      await this.workerPool.terminate(true)
    }
  }
}
