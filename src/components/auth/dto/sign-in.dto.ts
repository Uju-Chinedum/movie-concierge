import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}

export class SignInResponseDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  accessToken: string;
}