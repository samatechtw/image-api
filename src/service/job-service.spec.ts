import jobService, { JobService } from './job-service'
import { readFile } from 'node:fs/promises'
import path from 'path'
import pathStore from '../store/path-store'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { EnumFileFormat } from '../enum/enum-file-format'

describe('JobService', () => {
  jest.setTimeout(1000 * 1000)
  let onErrorMock: jest.Mock = null
  let onWaitingMock: jest.Mock = null

  beforeAll(async () => {
    jobService.init()
  })

  afterAll(async () => {
    await jobService.close()
  })

  beforeEach(() => {
    onErrorMock = jest.fn()
    onWaitingMock = jest.fn()
    jobService.onError = onErrorMock
    jobService.onWaiting = onWaitingMock
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
    await jobService.workerQueue.pause()

    expect(onErrorMock.mock.calls.length).toEqual(0)
    expect(onWaitingMock.mock.calls.length).toEqual(1)
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
