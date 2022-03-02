import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { ProcessData } from '../klass/process-data'
import { WorkerService } from '../service/worker-service'

@Processor('workerQueue')
export class JobProcessor {
  workerService: WorkerService
  private readonly logger = new Logger(JobProcessor.name)

  constructor() {
    this.workerService = new WorkerService()
    this.workerService.init()
  }

  @Process('processData')
  async handle(job: Job) {
    console.log('Start image processing...')
    const data: ProcessData = job.data
    await this.workerService.handlePath(
      data.tempInputPath,
      data.tempOutputPath,
      data.config,
    )
    this.logger.debug('Image processing completed')
  }
}
