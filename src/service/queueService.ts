import PQueue from 'p-queue'
import { cpus } from 'workerpool'
import ProcessJob from '../Klass/ProcessJob'
import { createClient } from 'redis'
import EnumProcessJobStatus from '../Enum/EnumProcessJobStatus'
import workerService from './workerService'

export class QueueService {
  queue = new PQueue({
    concurrency: cpus,
  })
  redis = createClient()

  async add(job: ProcessJob) {
    await this.queue.add(async () => {
      await workerService.handlePath(job.tempInputPath, job.tempOutputPath, job.config)
      job.status = EnumProcessJobStatus.complete
      await this.redis.set(job.id, job.toString())
      return
    })
    job.status = EnumProcessJobStatus.inQueue
    await this.redis.set(job.id, job.toString())
  }

  async removeById(jobId: string) {
    // todo: how to remove in p-queue?
    return await this.redis.del(jobId)
  }

  async getById(jobId: string) {
    return await this.redis.get(jobId)
  }

  async init() {
    await this.redis.connect()
  }

  constructor() {}
}

export default new QueueService()
