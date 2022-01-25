import JobService from './JobService'
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('job')
class JobController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async add(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const config = JSON.parse(body['config'])
    const jobId = await this.jobService.add(file.originalname, file.buffer, config)

    return jobId
  }

  @Delete(':id')
  async removeById() {}

  @Put(':id')
  async updateById() {}

  @Get()
  async getAll() {}

  @Get(':id')
  async getById() {}

  constructor(private readonly jobService: JobService) {}
}

export default JobController
