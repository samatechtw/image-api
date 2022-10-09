import path from 'path'
import { cpus, pool, WorkerPool } from 'workerpool'
import { IImageJobConfig } from '@samatech/image-api-types'
import { ServerImageHandler } from '../handler'
import { getPackageJsonDir } from '../util'

export class WorkerService {
  workerPool: WorkerPool = null

  ping = async (): Promise<string> => {
    const handler = new ServerImageHandler()
    const resBuffer = await this.workerPool.exec(handler.ping, [])

    return resBuffer
  }

  handlePath = async (inputPath: string, outputPath: string, config: IImageJobConfig) => {
    await this.workerPool.exec('handlePath', [inputPath, outputPath, config])
  }

  async close() {
    if (this.workerPool) {
      await this.workerPool.terminate(true)
    }
  }

  async init() {
    if (this.workerPool) {
      await this.workerPool.terminate(true)
    }
    const pkgDir = getPackageJsonDir()
    const workerPath = path.resolve(
      pkgDir,
      'dist/src/worker/server-image-handler-worker.js',
    )

    this.workerPool = pool(workerPath, {
      minWorkers: 'max',
      maxWorkers: cpus,
      workerType: 'process',
    })
  }
}

export const workerService = new WorkerService()
