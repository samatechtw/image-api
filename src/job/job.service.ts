import { writeFile } from 'node:fs/promises'
import _ from 'lodash'
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { ProcessData } from '../util/process-data'
import { FileFormat } from '../enum/file-format'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { isStringEnum } from '../util/is-string-enum'

@Injectable()
export class JobService {
  constructor(@InjectQueue('workerQueue') private readonly workerQueue: Queue) {}

  async add(
    fileName: string,
    fileBuffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<number> {
    if (!fileName.includes('.')) {
      throw new Error('Missing file format')
    }
    const fileFormat = fileName.split('.').pop()

    if (!isStringEnum(FileFormat, fileFormat)) {
      throw new Error('Unknown file format')
    }

    const processData = new ProcessData({
      config: {
        inputFormat: fileFormat as FileFormat,
        ...config,
      },
    })
    await writeFile(processData.tempInputPath, fileBuffer)
    const job = await this.workerQueue.add('processData', processData)

    return job.id as number
  }

  async removeById(jobId: number) {
    let job = await this.workerQueue.getJob(jobId)
    await job.remove()
  }

  async getAll(): Promise<ProcessData[]> {
    return []
  }

  async getById(jobId: number): Promise<ProcessData> {
    let data = await this.workerQueue.getJob(jobId)
    return data.data
  }

  // TODO -- this is only for testing, consider using a specific test module outside application code
  async clear() {
    // TODO is using force here ok, or are we hiding a bug in the tests?
    await this.workerQueue.obliterate({ force: true })
    // await this.workerQueue.close()
  }
}
