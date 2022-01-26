import queueService, { QueueService } from './queueService'
import ProcessData from '../Klass/ProcessData'
import { existsSync } from 'fs'
import pWaitFor from 'p-wait-for'
import { copyFile } from 'node:fs/promises'
import path from 'path'
import pathStore from '../store/pathStore'
import EnumFileFormat from '../Enum/EnumFileFormat'

describe('queueService basic', () => {
  it('constructor()', async () => {
    expect(queueService).toBeInstanceOf(QueueService)
  })

  it('init()', async () => {
    // todo
  })
})

describe('queueService', () => {
  beforeAll(async () => {
    await queueService.init()
  })

  it('add()', async () => {
    const data = new ProcessData({
      config: {
        inputFormat: EnumFileFormat.jpeg,
        outputFormat: EnumFileFormat.png,
      },
    })
    await copyFile(
      path.resolve(pathStore.testAsset, 'wtm_256x256.jpeg'),
      data.tempInputPath,
    )
    const jobId = await queueService.add(data)
    const job = await queueService.queue.getJob(jobId)

    await pWaitFor(() => job.isCompleted())

    expect(existsSync(data.tempOutputPath)).toEqual(true)
  })
})