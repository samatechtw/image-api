import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JobController } from './job.controller'
import { JobProcessor } from './job.processor'
import { JobService } from '../service/job-service'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workerQueue',
    }),
  ],
  controllers: [JobController],
  providers: [JobService, JobProcessor],
})
export class JobModule {}
