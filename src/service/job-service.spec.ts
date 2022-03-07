import { BullModule, getQueueToken } from '@nestjs/bull'
import { Test, TestingModule } from '@nestjs/testing'
import { EnumFileFormat } from '../enum/enum-file-format'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import jobService, { JobService } from './job-service'

describe('JobService', () => {
  it('constructor()', async () => {
    expect(jobService).toBeInstanceOf(JobService)
  })

  it('add()', async () => {
    // todo
  })

  it('add() throws error on missing file format', async () => {
    // todo
  })

  it('add() throws error on invalid file format', async () => {
    // todo
  })
})
