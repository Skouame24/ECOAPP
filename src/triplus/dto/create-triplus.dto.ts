import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTriPlusDto {
  @ApiProperty({ example: 'Guide de tri', description: 'Le titre de l\'information de tri' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Comment bien trier...', description: 'Le contenu de l\'information de tri' })
  @IsString()
  @IsNotEmpty()
  content: string;
}