import Bull, { ProcessPromiseFunction } from 'bull'
import { readFile } from 'node:fs/promises'
import { IJobData, ProcessJobStatusEnum } from '@samatech/image-api-types'
import { getTempInputPath, getTempOutputPath, uploadBufferToUrl } from '../util'
import { ServerImageHandler } from './server-image-handler'

const handler = new ServerImageHandler()

const process: ProcessPromiseFunction<IJobData> = async (job: Bull.Job<IJobData>) => {
  const tempInputPath = await getTempInputPath(job.data.id)
  const tempOutputPath = await getTempOutputPath(job.data.id)
  await handler.handlePath(tempInputPath, tempOutputPath, job.data.config)

  if (job.data.config.uploadUrl) {
    await job.update(
      Object.assign({}, job.data, {
        status: ProcessJobStatusEnum.Uploading,
      }),
    )

    const outBuffer = await readFile(tempOutputPath)
    if (job.data.config.uploadUrl) {
      await uploadBufferToUrl(job.data.config.uploadUrl, outBuffer)
    }
  }
}

export default process
