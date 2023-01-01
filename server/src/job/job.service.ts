import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common'
import Bull, {
  ActiveEventCallback,
  CleanedEventCallback,
  CompletedEventCallback,
  ErrorEventCallback,
  EventCallback,
  FailedEventCallback,
  ProgressEventCallback,
  RemovedEventCallback,
  StalledEventCallback,
  WaitingEventCallback,
} from 'bull'
import { writeFile } from 'node:fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import {
  IImageJobConfig,
  IJobData,
  IListJobsApiQuery,
  ProcessJobStatusEnum,
} from '@samatech/image-api-types'
import { apiConfig } from '../config'
import { getPackageJsonDir, getTempInputPath } from '../util'

@Injectable()
export class JobService implements OnApplicationShutdown {
  workerQueue: Bull.Queue<IJobData> = null

  async init() {
    const redisHost = apiConfig.get('redisHost')
    const redisPort = apiConfig.get('redisPort')
    Logger.debug(`Init Bull queue on ${redisHost}:${redisPort}`)
    this.workerQueue = new Bull<IJobData>('worker-queue', {
      redis: { host: redisHost, port: redisPort },
    })

    Logger.debug('Bull queue initializing...')
    const processPath = path.join(getPackageJsonDir(), 'dist/src/handler/process-job.js')
    this.workerQueue.process(8, processPath)
    console.log('Processor: ', processPath)
    this.setListeners()
    await this.workerQueue.isReady()
  }

  async add(
    filename: string,
    fileBuffer: Buffer,
    config: IImageJobConfig,
  ): Promise<string> {
    const id = uuidv4()
    const tempInputPath = await getTempInputPath(id)

    const jobData: IJobData = {
      id,
      filename,
      config,
      status: ProcessJobStatusEnum.Unknown,
    }
    await writeFile(tempInputPath, fileBuffer)
    const job = await this.workerQueue.add(jobData)

    return job.id as string
  }

  async removeById(jobId: string) {
    const job = await this.workerQueue.getJob(jobId)
    await job.remove()
  }

  async getById(jobId: string): Promise<IJobData> {
    const data = await this.workerQueue.getJob(jobId)
    return data.data
  }

  async getAll(options: IListJobsApiQuery): Promise<IJobData[]> {
    const jobs = await this.workerQueue.getJobs(
      options.types,
      options.start,
      options.end,
      options.asc,
    )
    return jobs.map((job) => ({
      ...job.data,
      jobId: Number(job.id),
    }))
  }

  onError: ErrorEventCallback = (_error) => {
    // console.log('onError', error)
  }

  onWaiting: WaitingEventCallback = (_jobId) => {
    // console.log('onWaiting', jobId)
  }

  onActive: ActiveEventCallback<IJobData> = async (job, _jobPromise) => {
    await job.update({ ...job.data, status: ProcessJobStatusEnum.Processing })
  }

  onStalled: StalledEventCallback<IJobData> = (_job) => {
    // console.log('onStalled', job?.id)
  }

  onProgress: ProgressEventCallback<IJobData> = (_job, _progress) => {
    // console.log('onProgress', job.id, progress)
  }

  onCompleted: CompletedEventCallback<IJobData> = async (job, _result) => {
    Logger.log('complete')
    await job.update({ ...job.data, status: ProcessJobStatusEnum.Complete })
  }

  onFailed: FailedEventCallback<IJobData> = async (job, error) => {
    Logger.error(error)
    await job.update({ ...job.data, status: ProcessJobStatusEnum.Fail })
  }

  onPaused: EventCallback = () => {
    // console.log('onPaused')
  }

  onResume: EventCallback = () => {
    // console.log('onResume')
  }

  onRemoved: RemovedEventCallback<IJobData> = (_job) => {
    // console.log('onRemoved')
  }

  onCleaned: CleanedEventCallback<IJobData> = (_jobs, _status) => {
    // console.log('onCleaned')
  }

  onDrained: EventCallback = () => {
    // console.log('onDrained')
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

  getWorkers(): Promise<unknown[]> {
    return this.workerQueue.getWorkers()
  }

  onApplicationShutdown(_signal: string) {
    Logger.debug('Job service workerQueue shutdown')
    return this.close()
  }

  async close() {
    this.workerQueue.removeAllListeners()
    await this.workerQueue.close()
  }

  async clean() {
    await this.workerQueue.pause()
    await this.workerQueue.clean(0, 'paused')
    await this.workerQueue.clean(0, 'wait')
    await this.workerQueue.clean(0, 'active')
    await this.workerQueue.clean(0, 'completed')
    await this.workerQueue.clean(0, 'failed')
    await this.workerQueue.resume()
  }
}
