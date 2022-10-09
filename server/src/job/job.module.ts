import { Module } from '@nestjs/common'
import { ApiAuthModule } from '../auth'
import { JobController } from './job.controller'

@Module({
  imports: [ApiAuthModule],
  controllers: [JobController],
})
export class JobModule {}
