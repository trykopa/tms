import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
