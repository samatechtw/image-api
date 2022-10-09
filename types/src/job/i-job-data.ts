import { ProcessJobStatusEnum } from '../enum'
import { IImageJobConfig } from './i-image-job-config'

export interface IJobData {
  id: string
  jobId?: number
  status: ProcessJobStatusEnum
  filename: string
  config: IImageJobConfig
}
