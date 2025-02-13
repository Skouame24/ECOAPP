import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNewsDto {
  @ApiProperty({
    description: 'Le titre de l\'actualité',
    example: 'Nouvelle actualité'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Le contenu de l\'actualité',
    example: 'Voici le contenu de l\'actualité.'
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}