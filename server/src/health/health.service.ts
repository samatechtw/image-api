import { BadRequestException, Injectable } from '@nestjs/common'
import { jobService } from '../service'

@Injectable()
export class HealthService {
  async ping() {
    const workers = await jobService.getWorkers()
    if (!workers || workers.length === 0) {
      throw new BadRequestException('No workers available')
    }
    return 'pong'
  }
}
