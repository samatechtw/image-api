import { Controller, Get } from '@nestjs/common'
import AppService from './AppService'

@Controller()
class AppController {
  @Get('ping')
  async ping() {
    return await this.appService.ping()
  }

  constructor(private readonly appService: AppService) {}
}

export default AppController
