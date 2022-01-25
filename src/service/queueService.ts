import ProcessData from '../Klass/ProcessData'
import Bull from 'bull'
import workerService from './workerService'

export class QueueService {
  queue = new Bull('workerQueue')

  async add(data: ProcessData): Promise<number> {
    const bullJob = await this.queue.add(data)
    return bullJob.id as number
  }

  async removeById(jobId: number) {
    let bullJob = await this.queue.getJob(jobId)
    await bullJob.remove()
  }

  async getById(jobId: number): Promise<ProcessData> {
    let bullJob = await this.queue.getJob(jobId)
    return bullJob.data
  }

  async init() {
    this.queue.process(async (bullJob) => {
      let data: ProcessData = bullJob.data
      await workerService.handlePath(data.tempInputPath, data.tempOutputPath, data.config)
    })
  }

  constructor() {}
}

export default new QueueService()
