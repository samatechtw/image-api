import { IsNumber, IsEnum, IsObject, IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { FileFormat } from '../enum/file-format'
import { OptimizationAlgorithm } from '../enum/optimization-algorithm'

class JobConfigDto implements IServerImageHandlerConfig {
  @ApiProperty({
    description: 'Input file format type',
    example: FileFormat.jpg,
    enum: FileFormat,
  })
  @IsEnum(FileFormat)
  inputFormat: FileFormat

  @ApiProperty({
    description: 'Input file format type',
    example: FileFormat.jpg,
    enum: FileFormat,
  })
  @IsOptional()
  @IsEnum(FileFormat)
  outputFormat?: FileFormat

  @ApiProperty({ description: 'Image width' })
  @IsOptional()
  @IsNumber()
  width?: number

  @ApiProperty({ description: 'Image height' })
  @IsOptional()
  @IsNumber()
  height?: number

  @ApiProperty({
    description: 'Optimization algorithm',
    example: OptimizationAlgorithm.mozjpeg,
    enum: OptimizationAlgorithm,
  })
  @IsOptional()
  @IsEnum(FileFormat)
  optimizeAlgo?: OptimizationAlgorithm

  quality?: number
}

export class CreateJobDto {
  @ApiProperty({ description: 'Job processing configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => JobConfigDto)
  config: JobConfigDto
}
