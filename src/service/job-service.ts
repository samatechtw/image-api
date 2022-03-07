import { writeFile } from 'node:fs/promises'
import { ProcessData } from '../klass/process-data'
import { EnumFileFormat } from '../enum/enum-file-format'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import stringHelper from '../helper/string-helper'
import Bull from "bull";

export class JobService {

  workerQueue = new Bull('worker-queue')

  async add(
    fileName: string,
    fileBuffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<number> {
    if (!fileName.includes('.')) {
      throw new Error('Missing file format')
    }
    const fileFormat = fileName.split('.').pop()

    if (!stringHelper.isInEnum(EnumFileFormat, fileFormat)) {
      throw new Error('Unknown file format')
    }

    const processData = new ProcessData({
      config: {
        inputFormat: fileFormat as EnumFileFormat,
        ...config,
      },
    })
    await writeFile(processData.tempInputPath, fileBuffer)
    const job = await this.workerQueue.add('processData', processData)

    return job.id as number
  }

  async removeById(jobId: number) {
    const job = await this.workerQueue.getJob(jobId)
    await job.remove()
  }

  async getAll(): Promise<ProcessData[]> {
    return []
  }

  async getById(jobId: number): Promise<ProcessData> {
    const data = await this.workerQueue.getJob(jobId)
    return data.data
  }
}

export default new JobService()
