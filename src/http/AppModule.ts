import { Module } from '@nestjs/common'
import AppService from './AppService'
import AppController from './AppController'
import JobController from './JobController'
import JobService from './JobService'

@Module({
  imports: [],
  controllers: [AppController, JobController],
  providers: [AppService, JobService],
})
class AppModule {}

export default AppModule
