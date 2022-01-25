import { Injectable } from '@nestjs/common'
import ProcessData from '../Klass/ProcessData'
import _ from 'lodash'
import EnumFileFormat from '../Enum/EnumFileFormat'
import IServerImageHandlerConfig from '../Interface/IServerImageHandlerConfig'
import queueService from '../service/queueService'
import { writeFile } from 'node:fs/promises'

@Injectable()
class JobService {
  async add(
    fileName: string,
    fileBuffer: Buffer,
    config: IServerImageHandlerConfig,
  ): Promise<number> {
    const fileFormat = _.last(fileName.split('.'))

    if (!Object.values(EnumFileFormat).includes(fileFormat as any)) {
      throw 'Unknown file format'
    }

    const processData = new ProcessData({
      config: {
        inputFormat: fileFormat as EnumFileFormat,
        ...config,
      },
    })
    await writeFile(processData.tempInputPath, fileBuffer)
    const jobId = await queueService.add(processData)

    return jobId
  }

  async removeById(jobId: number) {
    await queueService.removeById(jobId)
  }

  async getAll(): Promise<ProcessData[]> {
    return []
  }

  async getById(jobId: number): Promise<ProcessData> {
    let data = await queueService.getById(jobId)
    return data
  }
}

export default JobService
