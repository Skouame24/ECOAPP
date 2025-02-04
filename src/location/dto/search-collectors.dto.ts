import { IsNumber, IsNotEmpty } from 'class-validator';

export class SearchCollectorDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsNotEmpty()
  radius: number; // Rayon de recherche en kilomètres
}