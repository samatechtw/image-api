import { readFile, writeFile } from 'node:fs/promises'
import { ProcessData } from '../klass/process-data'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import Bull, {
  ActiveEventCallback,
  CleanedEventCallback,
  CompletedEventCallback,
  ErrorEventCallback,
  EventCallback,
  FailedEventCallback,
  ProcessPromiseFunction,
  ProgressEventCallback,
  RemovedEventCallback,
  StalledEventCallback,
  WaitingEventCallback,
} from 'bull'
import workerService from './worker-service'
import uploadService from './upload-service'
import { EnumProcessJobStatus } from '../enum/enum-process-job-status'
import { Logger } from '@nestjs/common'

export class JobService {
  workerQueue: Bull.Queue<ProcessData> = null

  add = async (
    fileName: string,
    fileBuffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<string> => {
    const processData = new ProcessData({
      config: config,
    })
    await writeFile(processData.tempInputPath, fileBuffer)
    const job = await this.workerQueue.add(processData)

    return job.id as string
  }

  removeById = async (jobId: string) => {
    const job = await this.workerQueue.getJob(jobId)
    await job.remove()
  }

  getById = async (jobId: string): Promise<ProcessData> => {
    const data = await this.workerQueue.getJob(jobId)
    return data.data
  }

  onError: ErrorEventCallback = (_error) => {
    // console.log('onError')
  }

  onWaiting: WaitingEventCallback = (_jobId) => {
    // console.log('onWaiting')
  }

  onActive: ActiveEventCallback<ProcessData> = async (job, _jobPromise) => {
    await job.update(
      Object.assign({}, job.data, {
        status: EnumProcessJobStatus.processing,
      }),
    )
  }

  onStalled: StalledEventCallback<ProcessData> = (_job) => {
    // console.log('onStalled')
  }

  onProgress: ProgressEventCallback<ProcessData> = (_job, _progress) => {
    // console.log('onProgress')
  }

  onCompleted: CompletedEventCallback<ProcessData> = async (job, _result) => {
    Logger.log('complete')
    await job.update(
      Object.assign({}, job.data, {
        status: EnumProcessJobStatus.complete,
      }),
    )
  }

  onFailed: FailedEventCallback<ProcessData> = async (job, error) => {
    Logger.error(error)
    await job.update(
      Object.assign({}, job.data, {
        status: EnumProcessJobStatus.fail,
      }),
    )
  }

  onPaused: EventCallback = () => {
    // console.log('onPaused')
  }

  onResume: EventCallback = () => {
    // console.log('onResume')
  }

  onRemoved: RemovedEventCallback<ProcessData> = (_job) => {
    // console.log('onRemoved')
  }

  onCleaned: CleanedEventCallback<ProcessData> = (_jobs, _status) => {
    // console.log('onCleaned')
  }

  onDrained: EventCallback = () => {
    // console.log('onDrained')
  }

  process: ProcessPromiseFunction<ProcessData> = async (job) => {
    await workerService.handlePath(
      job.data.tempInputPath,
      job.data.tempOutputPath,
      job.data.config,
    )

    if (job.data.hasS3) {
      await job.update(
        Object.assign({}, job.data, {
          status: EnumProcessJobStatus.uploadingToS3,
        }),
      )

      const outBuffer = await readFile(job.data.tempOutputPath)

      await uploadService.toS3(
        outBuffer,
        job.data.config.s3Region,
        job.data.config.s3BucketName,
      )
    }
  }

  // for test
  setListeners = () => {
    this.workerQueue.on('error', this.onError)
    this.workerQueue.on('waiting', this.onWaiting)
    this.workerQueue.on('active', this.onActive)
    this.workerQueue.on('stalled', this.onStalled)
    this.workerQueue.on('progress', this.onProgress)
    this.workerQueue.on('completed', this.onCompleted)
    this.workerQueue.on('failed', this.onFailed)
    this.workerQueue.on('paused', this.onPaused)
    this.workerQueue.on('resumed', this.onResume)
    this.workerQueue.on('removed', this.onRemoved)
    this.workerQueue.on('cleaned', this.onCleaned)
    this.workerQueue.on('drained', this.onDrained)
  }

  init = async () => {
    this.workerQueue = new Bull<ProcessData>('worker-queue')
    this.workerQueue.process(this.process)
    this.setListeners()
    await this.workerQueue.isReady()
  }

  close = async () => {
    this.workerQueue.removeAllListeners()
    await this.workerQueue.close()
  }

  clean = async () => {
    await this.workerQueue.pause()
    await this.workerQueue.clean(0, 'paused')
    await this.workerQueue.clean(0, 'wait')
    await this.workerQueue.clean(0, 'active')
    await this.workerQueue.clean(0, 'completed')
    await this.workerQueue.clean(0, 'failed')
    await this.workerQueue.resume()
  }
}

export default new JobService()
