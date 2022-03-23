import jobService, { JobService } from './job-service'
import { readFile } from 'node:fs/promises'
import path from 'path'
import pathStore from '../store/path-store'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { EnumFileFormat } from '../enum/enum-file-format'
import workerService from './worker-service'

describe('JobService', () => {
  beforeAll(async () => {
    await workerService.init()
    await jobService.init()
  })

  afterAll(async () => {
    await workerService.close()
    await jobService.close()
  })

  beforeEach(async () => {
    await jobService.clean()
    jobService.setListeners()
  })

  it('constructor()', async () => {
    expect(jobService).toBeInstanceOf(JobService)
  })

  it('add()', async () => {
    const fileName = 'wtm_256x256.jpeg'
    const buffer = await readFile(path.resolve(pathStore.testAsset, fileName))
    const config: IServerImageHandlerConfig = {
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
