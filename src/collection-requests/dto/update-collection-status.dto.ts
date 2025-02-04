import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CollectionStatus } from '@prisma/client';

export class UpdateCollectionStatusDto {
  @ApiProperty({ 
    enum: CollectionStatus, 
    description: 'Nouveau statut de la collecte',
  })
  @IsEnum(CollectionStatus)
  status: CollectionStatus;
}
