import { ApiProperty } from '@nestjs/swagger'
import { IListJobsApiQuery, WorkerJobStatusEnum } from '@samatech/image-api-types'
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator'

export class ListJobsQuery implements IListJobsApiQuery {
  @ApiProperty({
    description: 'Input file format type',
    example: WorkerJobStatusEnum.Completed,
    enum: WorkerJobStatusEnum,
  })
  @IsOptional()
  @IsEnum(WorkerJobStatusEnum)
  types?: WorkerJobStatusEnum[]

  @ApiProperty({ description: 'Job start ID' })
  @IsOptional()
  @IsNumber()
  start?: number

  @ApiProperty({ description: 'Job end ID' })
  @IsOptional()
  @IsNumber()
  end?: number

  @ApiProperty({ description: 'Job sort direction' })
  @IsOptional()
  @IsBoolean()
  asc?: boolean
}
