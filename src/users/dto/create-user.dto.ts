import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'Jean' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Dupont' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'jean.dupont@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'motdepasse123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: '+33612345678' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ enum: UserType, example: UserType.CLIENT })
  @IsEnum(UserType)
  type: UserType;
}