import { Controller, Get } from '@nestjs/common'
import { HealthService } from './health.service'

@Controller()
export class HealthController {
  @Get('ping')
  async ping() {
    return await this.healthService.ping()
  }

  constructor(private readonly healthService: HealthService) {}
}
