import { BadRequestException, Injectable } from '@nestjs/common'
import { JobService } from '../job'

@Injectable()
export class HealthService {
  constructor(private readonly jobService: JobService) {}

  async ping() {
    const workers = await this.jobService.getWorkers()
    if (!workers || workers.length === 0) {
      throw new BadRequestException('No workers available')
    }
    return 'pong'
  }
}
