import { BullModule, getQueueToken } from '@nestjs/bull'
import { Test, TestingModule } from '@nestjs/testing'
import { FileFormat } from '../enum/file-format'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { JobService } from './job-service'

describe('JobService', () => {
  let jobService: JobService
  let testConfig: IServerImageHandlerConfig
  let testBuffer: Buffer
  let mockQueue

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(() => ({ id: 1 })),
    }
    testConfig = {
      inputFormat: FileFormat.jpg,
    }
    testBuffer = Buffer.from([21, 31])

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'workerQueue',
        }),
      ],
      providers: [JobService],
    })
      .overrideProvider(getQueueToken('workerQueue'))
      .useValue(mockQueue)
      .compile()

    jobService = moduleRef.get<JobService>(JobService)
  })

  it('constructor()', async () => {
    expect(jobService).toBeInstanceOf(JobService)
  })

  it('adds to queue', async () => {
    await jobService.add('test.jpg', testBuffer, testConfig)
    expect(mockQueue.add).toHaveBeenCalledTimes(1)
  })

  it('throws error on missing file format', async () => {
    await expect(jobService.add('test', testBuffer, testConfig)).rejects.toThrow(
      'Missing file format',
    )
  })

  it('throws error on invalid file format', async () => {
    await expect(jobService.add('test.bad', testBuffer, testConfig)).rejects.toThrow(
      'Unknown file format',
    )
  })
})
