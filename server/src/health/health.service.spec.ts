import { Test, TestingModule } from '@nestjs/testing'
import { JobService } from '../job'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

describe('HealthService', () => {
  let healthService: HealthService
  let jobService: JobService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService, JobService],
    }).compile()

    healthService = moduleRef.get<HealthService>(HealthService)
    jobService = moduleRef.get<JobService>(JobService)
  })

  it('ping()', async () => {
    jest
      .spyOn(jobService, 'getWorkers')
      .mockImplementation(() => Promise.resolve(['worker1', 'worker2']))

    const res = await healthService.ping()

    expect(res).toEqual('pong')
  })
})
