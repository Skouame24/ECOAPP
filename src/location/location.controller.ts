import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/decorator/user.decorator';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('location')
@Controller('location')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('update')
  @ApiOperation({ summary: 'Mettre à jour la position du pré-collecteur' })
  async updateLocation(
    @User('id') preCollectorId: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.updateLocation(preCollectorId, updateLocationDto);
  }

  @Get('active-location')
  @ApiOperation({ summary: 'Obtenir la dernière position du pré-collecteur' })
  async getActiveLocation(@User('id') preCollectorId: string) {
    return this.locationService.getActiveLocation(preCollectorId);
  }
}