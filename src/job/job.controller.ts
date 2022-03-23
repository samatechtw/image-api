import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { ICreateImageJobResponse } from '../interface/i-create-job-response'
import 'multer'
import { JobConfigDto } from './create-job.dto'
import jobService from '../service/job-service'

@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  @ApiOperation({
    summary: 'Post a new job',
    description:
      'Request for image processing. A supported file and configuration must be ' +
      'provided. If the image has previously been processed and the required output ' +
      'artifacts exist, processing is skipped.',
  })
  @ApiResponse({
    status: 201,
    description: 'Job has been created, and ID is returned in response',
  })
  @ApiResponse({ status: 400, description: 'The request is invalid' })
  @ApiResponse({
    status: 403,
    description: 'The endpoint has been invoked by an unauthorized client',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async add(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ): Promise<ICreateImageJobResponse> {
    const config: JobConfigDto = JSON.parse(body['config'])
    const jobId = await jobService.add(file.originalname, file.buffer, config)

    return { jobId }
  }

  @ApiOperation({
    summary: 'Delete an existing job',
    description: 'Cancels a job, if it exists and has not already been completed.',
  })
  @ApiResponse({
    status: 204,
    description: 'Job has been deleted',
  })
  @ApiResponse({ status: 400, description: 'The request is invalid' })
  @ApiResponse({
    status: 403,
    description: 'The endpoint has been invoked by an unauthorized client',
  })
  @Delete(':id')
  async removeById(@Param('id') id: string) {
    await jobService.removeById(id)
  }

  @ApiOperation({
    summary: 'Get all jobs',
    description: 'Get all jobs with filtering.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of jobs returned in response.',
  })
  @ApiResponse({ status: 400, description: 'The request is invalid' })
  @ApiResponse({
    status: 403,
    description: 'The endpoint has been invoked by an unauthorized client',
  })
  @Get('/')
  async getAll() {
    // TODO -- implement
    // TODO -- add filters
    return []
  }

  @ApiOperation({
    summary: 'Get job detail',
    description: 'Get details about a single job by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of jobs returned in response.',
  })
  @ApiResponse({ status: 400, description: 'The request is invalid' })
  @ApiResponse({
    status: 403,
    description: 'The endpoint has been invoked by an unauthorized client',
  })
  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await jobService.getById(id)
    return data
  }
}
