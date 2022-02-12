import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthService {
  async ping() {
    return 'pong'
  }
}
