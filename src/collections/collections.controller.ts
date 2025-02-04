import { Controller, Post, Body, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { IUser } from '../auth/interfaces/user.interface';

interface AuthenticatedRequest extends ExpressRequest {
  user: IUser;
}

@ApiTags('collections')
@Controller('collections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post('location')
  @ApiOperation({ summary: 'Mettre à jour la position du pré-collecteur' })
  @ApiResponse({ status: 200, description: 'Position mise à jour' })
  async updateLocation(@Body() location: UpdateLocationDto, @Request() req: AuthenticatedRequest) {
    return this.collectionsService.updatePreCollectorLocation(req.user.id, location);
  }

  @Get(':id/track')
  @ApiOperation({ summary: 'Obtenir la position actuelle du pré-collecteur' })
  @ApiResponse({ status: 200, description: 'Position du pré-collecteur' })
  async trackPreCollector(
    @Param('id') preCollectorId: string,
    @Query('clientLat') clientLat?: number,
    @Query('clientLng') clientLng?: number,
  ) {
    const clientLocation = clientLat && clientLng 
      ? { latitude: clientLat, longitude: clientLng }
      : undefined;
    
    return this.collectionsService.getPreCollectorLocation(preCollectorId, clientLocation);
  }

  @Get(':id/history')
  @ApiOperation({ summary: 'Obtenir l\'historique des positions' })
  @ApiResponse({ status: 200, description: 'Historique des positions' })
  async getLocationHistory(@Param('id') preCollectorId: string) {
    return this.collectionsService.getLocationHistory(preCollectorId);
  }
}