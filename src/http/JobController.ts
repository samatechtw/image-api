import JobService from './JobService'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('job')
class JobController {
  @Post()
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async add(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const config = JSON.parse(body['config'])
    const jobId = await this.jobService.add(file.originalname, file.buffer, config)

    return jobId
  }

  @Delete(':id')
  @HttpCode(204)
  async removeById(@Param('id') id: string) {
    await this.jobService.removeById(parseInt(id))
  }

  @Get()
  @HttpCode(200)
  async getAll() {}

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    let data = await this.jobService.getById(parseInt(id))
    return data
  }

  constructor(private readonly jobService: JobService) {}
}

export default JobController
