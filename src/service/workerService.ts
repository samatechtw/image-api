import path from 'path'
import pathStore from '../../pathStore'
import { cpus, pool } from 'workerpool'
import { Buffer } from 'buffer'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import ProcessData from '../Klass/ProcessData'

export class WorkerService {
  private get workerPath() {
    return path.resolve(pathStore.dist, 'serverImageHandlerWorker.js')
  }

  private workerPool = pool(this.workerPath, {
    minWorkers: 'max',
    maxWorkers: cpus,
    workerType: 'process',
  })

  async ping(): Promise<string> {
    let resBuffer = await this.workerPool.exec('ping', [])

    return resBuffer
  }

  async handlePath(
    inputPath: string,
    outputPath: string,
    config: IServerImageHandlerConfig,
  ) {
    await this.workerPool.exec('handlePath', [inputPath, outputPath, config])
  }
}

export default new WorkerService()
