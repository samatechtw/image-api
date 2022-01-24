import JobService from './JobService'
import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common'
import AddJobDto from '../Dto/AddJobDto'

@Controller('queue')
class JobController {
  @Post()
  async add(@Body() addQueueDto: AddJobDto) {}

  @Delete(':id')
  async removeById() {}

  @Put(':id')
  async updateById() {}

  @Get()
  async getAll() {}

  @Get(':id')
  async getById() {}

  constructor(private readonly queueService: JobService) {}
}

export default JobController
