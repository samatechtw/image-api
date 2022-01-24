import { Injectable } from '@nestjs/common'

@Injectable()
class AppService {
  async ping() {
    return 'pong'
  }
}

export default AppService
