import { IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ description: 'Latitude de l\'utilisateur' })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude de l\'utilisateur' })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}