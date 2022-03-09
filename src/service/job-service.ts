import { readFile, writeFile } from 'node:fs/promises'
import { ProcessData } from '../klass/process-data'
import { EnumFileFormat } from '../enum/enum-file-format'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import stringHelper from '../helper/string-helper'
import Bull, {
  ActiveEventCallback,
  CleanedEventCallback,
  CompletedEventCallback,
  ErrorEventCallback,
  EventCallback,
  FailedEventCallback,
  ProcessCallbackFunction,
  ProcessPromiseFunction,
  ProgressEventCallback,
  RemovedEventCallback,
  StalledEventCallback,
  WaitingEventCallback,
} from 'bull'
import envStore from '../store/env-store'
import workerService from './worker-service'
import uploadService from './upload-service'

export class JobService {
  workerQueue = new Bull<ProcessData>('worker-queue')

  add = async (
    fileName: string,
    fileBuffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<number> => {
    const processData = new ProcessData({
      config: config,
    })
    await writeFile(processData.tempInputPath, fileBuffer)
    const job = await this.workerQueue.add('processData', processData)

    return job.id as number
  }

  removeById = async (jobId: number) => {
    const job = await this.workerQueue.getJob(jobId)
    await job.remove()
  }

  getById = async (jobId: number): Promise<ProcessData> => {
    const data = await this.workerQueue.getJob(jobId)
    return data.data
  }

  onError: ErrorEventCallback = (error) => {
    // console.log('onError')
  }

  onWaiting: WaitingEventCallback = (jobId) => {
    // console.log('onWaiting')
  }

  onActive: ActiveEventCallback<ProcessData> = (job, jobPromise) => {
    // console.log('onActive')
  }

  onStalled: StalledEventCallback<ProcessData> = (job) => {
    // console.log('onStalled')
  }

  onProgress: ProgressEventCallback<ProcessData> = (job, progress) => {
    // console.log('onProgress')
  }

  onCompleted: CompletedEventCallback<ProcessData> = (job, result) => {
    // console.log('onCompleted')
  }

  onFailed: FailedEventCallback<ProcessData> = (job, error) => {
    // console.log('onFailed')
  }

  onPaused: EventCallback = () => {
    // console.log('onPaused')
  }

  onResume: EventCallback = () => {
    // console.log('onResume')
  }

  onRemoved: RemovedEventCallback<ProcessData> = (job) => {
    // console.log('onRemoved')
  }

  onCleaned: CleanedEventCallback<ProcessData> = (jobs, status) => {
    // console.log('onCleaned')
  }

  onDrained: EventCallback = () => {
    // console.log('onDrained')
  }

  process: ProcessPromiseFunction<ProcessData> = async (job) => {
    let processData = job.data

    await workerService.handlePath(
      processData.tempInputPath,
      processData.tempOutputPath,
      processData.config,
    )

    if (processData.hasS3) {
      const outBuffer = await readFile(processData.tempOutputPath)

      await uploadService.toS3(
        outBuffer,
        processData.config.s3Region,
        processData.config.s3BucketName,
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

  init = () => {
    this.setListeners()
    this.workerQueue.process(envStore.workerCount, this.process)
  }

  close = async () => {
    this.workerQueue.removeAllListeners()
    await this.workerQueue.close()
  }

  constructor() {}
}

export default new JobService()
