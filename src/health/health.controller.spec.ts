import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

describe('HealthService', () => {
  let healthService: HealthService
  let healthController: HealthController

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile()

    healthService = moduleRef.get<HealthService>(HealthService)
    healthController = moduleRef.get<HealthController>(HealthController)
  })

  it('ping()', async () => {
    const res = await healthService.ping()

    expect(res).toEqual('pong')
    await expect(healthController.ping()).resolves.toBe('pong')
  })
})
