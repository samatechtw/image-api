import { Test, TestingModule } from '@nestjs/testing'
import { jobService } from '../service'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

jest.mock('../service')
const mockedJobService = jobService as jest.Mocked<typeof jobService>

describe('HealthService', () => {
  let healthService: HealthService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile()

    healthService = moduleRef.get<HealthService>(HealthService)
  })

  it('ping()', async () => {
    mockedJobService.getWorkers = jest.fn(() => Promise.resolve(['worker1', 'worker2']))
    const res = await healthService.ping()

    expect(res).toEqual('pong')
  })
})
