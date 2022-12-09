import { Module } from '@nestjs/common'
import { ApiAuthModule } from '../auth'
import { JobController } from './job.controller'
import { JobService } from './job.service'

const jobServiceFactory = {
  provide: JobService,
  useFactory: async () => {
    const jobService = new JobService()
    await jobService.init()
    return jobService
  },
}

@Module({
  imports: [ApiAuthModule],
  providers: [jobServiceFactory],
  controllers: [JobController],
  exports: [jobServiceFactory],
})
export class JobModule {}
