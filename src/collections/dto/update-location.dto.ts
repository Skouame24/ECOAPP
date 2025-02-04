import { IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty({ example: 48.8566 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsLongitude()
  longitude: number;
}