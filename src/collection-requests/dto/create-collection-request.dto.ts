import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID, Min } from 'class-validator';
import { WasteType } from '@prisma/client';

export class CreateCollectionRequestDto {
  @ApiProperty({ enum: WasteType, description: 'Type de déchet' })
  @IsEnum(WasteType)
  wasteType: WasteType;

  @ApiProperty({ description: 'Poids des déchets en kg' })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({ description: 'Prix proposé' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Latitude du point de collecte' })
  @IsNumber()
  pickupLatitude: number;

  @ApiProperty({ description: 'Longitude du point de collecte' })
  @IsNumber()
  pickupLongitude: number;

  @ApiProperty({ description: 'ID du pré-collecteur choisi', required: false })
  @IsUUID()
  preCollectorId?: string;
}