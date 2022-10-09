import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  ICreateJobApiResponse,
  IGetJobApiResponse,
  IListJobsApiResponse,
} from '@samatech/image-api-types'
import 'multer'
import { jobService } from '../service'
import { JobConfigDto } from './create-job.dto'
import { ListJobsQuery } from './list-jobs.query'

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
    description: 'Create a job and return the ID',
  })
  @ApiResponse({ status: 400, description: 'The request is invalid' })
  @ApiResponse({
    status: 403,
    description: 'The endpoint has been invoked by an unauthorized client',
  })
  @ApiHeader({
    name: 'X-IMAGE-API-KEY',
    description: 'API Key for external access',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(AuthGuard(['apiKey']))
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async add(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: JobConfigDto,
  ): Promise<ICreateJobApiResponse> {
    if (!file) {
      throw new BadRequestException('Missing file')
    }
    const jobId = await jobService.add(file.originalname, file.buffer, dto)

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
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for external access',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(AuthGuard(['apiKey']))
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
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for external access',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(AuthGuard(['apiKey']))
  @Get('/')
  async listJobs(@Query() dto: ListJobsQuery): Promise<IListJobsApiResponse> {
    const jobs = await jobService.getAll(dto)
    return jobs
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
  @ApiHeader({
    name: 'X-API-KEY',
    description: 'API Key for external access',
    required: true,
    allowEmptyValue: false,
  })
  @UseGuards(AuthGuard(['apiKey']))
  @Get(':id')
  async getById(@Param('id') id: string): Promise<IGetJobApiResponse> {
    const data = await jobService.getById(id)
    return data
  }
}
