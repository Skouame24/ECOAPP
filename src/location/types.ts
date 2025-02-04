export interface CollectorWithDistance {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    latitude: number;
    longitude: number;
    distance: number; // Distance en kilomètres
  }
  import { ApiProperty } from '@nestjs/swagger';

export class CollectorWithDistance {
  @ApiProperty({ description: 'Identifiant unique du collecteur' })
  id: string;

  @ApiProperty({ description: 'Prénom du collecteur' })
  firstName: string;

  @ApiProperty({ description: 'Nom du collecteur' })
  lastName: string;

  @ApiProperty({ description: 'Numéro de téléphone du collecteur' })
  phoneNumber: string;

  @ApiProperty({ description: 'Latitude de la position du collecteur' })
  latitude: number;

  @ApiProperty({ description: 'Longitude de la position du collecteur' })
  longitude: number;

  @ApiProperty({ description: 'Distance en kilomètres entre le collecteur et le point de recherche' })
  distance: number;
}