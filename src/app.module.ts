import { Module } from '@nestjs/common'
import { HealthModule } from './health/health.module'
import { JobModule } from './job/job.module'

@Module({
  imports: [HealthModule, JobModule],
})
export class AppModule {}
