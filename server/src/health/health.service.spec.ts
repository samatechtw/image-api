import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

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
    const res = await healthService.ping()

    expect(res).toEqual('pong')
  })
})
