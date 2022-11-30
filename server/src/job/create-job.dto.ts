import { ApiProperty } from '@nestjs/swagger'
import {
  EnumFileFormat,
  EnumOptimizationAlgorithm,
  IImageJobConfig,
} from '@samatech/image-api-types'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class JobConfigDto implements IImageJobConfig {
  @ApiProperty({
    description: 'Input file format type',
    example: EnumFileFormat.jpg,
    enum: EnumFileFormat,
  })
  @IsEnum(EnumFileFormat)
  inputFormat: EnumFileFormat

  @ApiProperty({
    description: 'Input file format type',
    example: EnumFileFormat.jpg,
    enum: EnumFileFormat,
  })
  @IsOptional()
  @IsEnum(EnumFileFormat)
  outputFormat?: EnumFileFormat

  @ApiProperty({ description: 'Image width' })
  @IsOptional()
  @Min(4)
  @Max(40000000)
  @IsNumber()
  @Transform(({ value }) => Number(value))
  width?: number

  @ApiProperty({ description: 'Image height' })
  @IsOptional()
  @IsNumber()
  @Min(4)
  @Max(40000000)
  @Transform(({ value }) => Number(value))
  height?: number

  @ApiProperty({
    description: 'Optimization algorithm',
    example: EnumOptimizationAlgorithm.mozjpeg,
    enum: EnumOptimizationAlgorithm,
  })
  @IsOptional()
  @IsEnum(EnumOptimizationAlgorithm)
  optimizeAlgo?: EnumOptimizationAlgorithm

  @ApiProperty({
    description: 'Image quality. It is required when you try to optimize image.',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Transform(({ value }) => Number(value))
  quality?: number

  @ApiProperty({
    description: 'The url where compressed image should be uploaded to.',
  })
  @IsOptional()
  @IsString()
  uploadUrl?: string
}
