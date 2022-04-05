import { Module } from '@nestjs/common'
import { HealthModule } from './health'
import { JobModule } from './job'

@Module({
  imports: [HealthModule, JobModule],
})
export class AppModule {}
