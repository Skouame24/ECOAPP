import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserType, PointCategory } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ enum: UserType })
  @IsNotEmpty()
  @IsEnum(UserType)
  type: UserType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ enum: PointCategory })
  @IsOptional()
  @IsEnum(PointCategory)
  category?: PointCategory;
}