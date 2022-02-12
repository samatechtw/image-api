import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { HealthModule } from './health/health.module'
import { JobModule } from './job/job.module'

@Module({
  imports: [
    HealthModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    JobModule,
  ],
})
export class AppModule {}
