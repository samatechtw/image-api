import { IsNumber, IsEnum, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IServerImageHandlerConfig } from '../interface/i-server-image-handler-config'
import { EnumFileFormat } from '../enum/enum-file-format'
import { EnumOptimizationAlgorithm } from '../enum/enum-optimization-algorithm'

export class JobConfigDto implements IServerImageHandlerConfig {
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
  @IsNumber()
  width?: number

  @ApiProperty({ description: 'Image height' })
  @IsOptional()
  @IsNumber()
  height?: number

  @ApiProperty({
    description: 'Optimization algorithm',
    example: EnumOptimizationAlgorithm.mozjpeg,
    enum: EnumOptimizationAlgorithm,
  })
  @IsOptional()
  @IsEnum(EnumFileFormat)
  optimizeAlgo?: EnumOptimizationAlgorithm

  @ApiProperty({
    description: 'Image quality. It is required when you try to optimize image.',
  })
  @IsOptional()
  @IsNumber()
  quality?: number
}
