import { readFile } from 'node:fs/promises'
import path from 'path'
import { EnumFileFormat, IImageJobConfig } from '@samatech/image-api-types'
import { JobService, jobService } from './job-service'

jest.setTimeout(10000)

describe('JobService', () => {
  let testAsset: string

  beforeAll(async () => {
    await jobService.init()
  })

  afterAll(async () => {
    await jobService.close()
  })

  beforeEach(async () => {
    testAsset = path.resolve(__dirname, '../../../tools/test-assets')
    await jobService.clean()
    jobService.setListeners()
  })

  it('constructor()', async () => {
    expect(jobService).toBeInstanceOf(JobService)
  })

  it('add()', async () => {
    const fileName = 'wtm_256x256.jpeg'
    const buffer = await readFile(path.resolve(testAsset, fileName))
    const config: IImageJobConfig = {
      inputFormat: EnumFileFormat.jpeg,
    }

    await jobService.add(fileName, buffer, config)
    let jobCounts = await jobService.workerQueue.getJobCounts()

    expect(jobCounts.active).toEqual(1)
    expect(jobCounts.completed).toEqual(0)
    expect(jobCounts.failed).toEqual(0)

    await new Promise((resolve) => setTimeout(resolve, 1000))
    jobCounts = await jobService.workerQueue.getJobCounts()

    expect(jobCounts.active).toEqual(0)
    expect(jobCounts.completed).toEqual(1)
    expect(jobCounts.failed).toEqual(0)
  })

  it('add() invalid fileName', async () => {
    // todo
  })

  it('add() invalid buffer', async () => {
    // todo
  })

  it('add() invalid config', async () => {
    // todo
  })
})
