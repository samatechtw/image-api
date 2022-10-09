import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { HealthService } from './health.service'

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('ping')
  async ping() {
    return await this.healthService.ping()
  }

  constructor(private readonly healthService: HealthService) {}
}
