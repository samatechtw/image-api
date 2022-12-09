import { Module } from '@nestjs/common'
import { JobModule } from '../job'
import { HealthController } from './health.controller'
import { HealthService } from './health.service'

@Module({
  imports: [JobModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
