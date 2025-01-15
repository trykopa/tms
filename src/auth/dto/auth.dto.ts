import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'test@test.com',
    type: 'string',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
    type: 'string',
    required: true,
  })
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Email address',
    example: 'test@test.com',
    type: 'string',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password',
    type: 'string',
    required: true,
  })
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password too weak. It must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  password: string;

  @ApiProperty({
    description: 'Name',
    example: 'John Doe',
    type: 'string',
    required: true,
  })
  @IsString()
  @MinLength(2)
  name: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token',
    type: 'string',
    required: true,
  })
  @IsString()
  refresh_token: string;
}
