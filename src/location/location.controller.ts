import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CollectorWithDistance } from './types';
import { SearchCollectorDto } from './dto/search-collectors.dto';

@ApiTags('Location')
@Controller('location')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('collectors')
  @ApiOperation({ 
    summary: 'Rechercher les pré-collecteurs à proximité',
    description: 'Trouve les pré-collecteurs disponibles dans un rayon donné'
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des pré-collecteurs trouvés avec leurs distances',
    type: CollectorWithDistance,
    isArray: true
  })
  async findNearbyCollectors(
    @Query() searchParams: SearchCollectorDto
  ): Promise<CollectorWithDistance[]> {
    return this.locationService.findNearbyCollectors(searchParams);
  }
}