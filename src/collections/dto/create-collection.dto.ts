import { IsEnum, IsNumber, IsString, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WasteType } from '@prisma/client';

export class CreateCollectionDto {
  @ApiProperty({ example: WasteType.ORGANIC })
  @IsEnum(WasteType)
  wasteType: WasteType;

  @ApiProperty({ example: 10.5 })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 25.0 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 48.8566 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 2.3522 })
  @IsLongitude()
  longitude: number;
}