import { Controller, Post, Body, Get, Param, UseGuards, Query, Patch, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CollectionRequestsService } from './collection-requests.service';
import { CreateCollectionRequestDto } from './dto/create-collection-request.dto';
import { UpdateCollectionStatusDto } from './dto/update-collection-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/decorator/user.decorator';
import { CollectionStatus } from '@prisma/client';
import { Logger } from '@nestjs/common';

@ApiTags('collection-requests')
@Controller('collection-requests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CollectionRequestsController {
  private readonly logger = new Logger(CollectionRequestsController.name);

  constructor(private readonly collectionRequestsService: CollectionRequestsService) {}

  // Création d'une nouvelle demande
  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle demande de collecte' })
  @ApiResponse({ status: 201, description: 'Demande créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(
    @User('id') clientId: string,
    @Body() createCollectionRequestDto: CreateCollectionRequestDto,
  ) {
    if (!createCollectionRequestDto.wasteType || !createCollectionRequestDto.weight || !createCollectionRequestDto.price) {
      throw new BadRequestException('Tous les champs sont requis');
    }
    
    return this.collectionRequestsService.create(clientId, createCollectionRequestDto);
  }

  // Obtenir l'ID de l'utilisateur connecté
  @Get('me')
  @ApiOperation({ summary: 'Obtenir l\'ID de l\'utilisateur connecté' })
  async getMe(@User('id') userId: string) {
    return { userId };
  }

  // Liste des demandes d'un client
  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les demandes de collecte du client' })
  async findAllByClient(@User('id') clientId: string) {
    return this.collectionRequestsService.findAllByClient(clientId);
  }

  // Liste des demandes pour un pré-collecteur
  @Get('pre-collector/:preCollectorId')
  @ApiOperation({ summary: 'Obtenir toutes les demandes de collecte pour un pré-collecteur' })
  @ApiParam({ name: 'preCollectorId', type: String })
  async findAllByPreCollector(@Param('preCollectorId') preCollectorId: string) {
    this.logger.log(`Récupération des demandes de collecte pour le pré-collecteur ${preCollectorId}`);
    const requests = await this.collectionRequestsService.findAllByPreCollector(preCollectorId);
    
    this.logger.log(`Demandes récupérées pour ${preCollectorId}: ${JSON.stringify(requests)}`);
    
    return requests;
  }

  // Recherche des demandes à proximité
  @Get('nearby')
  @ApiOperation({ summary: 'Obtenir les demandes de collecte à proximité' })
  async findNearbyRequests(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 5,
  ) {
    if (!latitude || !longitude) {
      throw new BadRequestException('Les coordonnées sont requises');
    }
    return this.collectionRequestsService.findNearbyRequests(latitude, longitude, radius);
  }

  // Mise à jour du statut (PATCH car modification partielle)
  @Patch(':id/status')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une demande de collecte' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour avec succès' })
  @ApiResponse({ status: 400, description: 'Statut invalide ou transition non autorisée' })
  @ApiResponse({ status: 403, description: 'Accès non autorisé' })
  @ApiResponse({ status: 404, description: 'Demande non trouvée' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateCollectionStatusDto })
  async updateStatus(
    @User('id') preCollectorId: string,
    @Param('id') collectionId: string,
    @Body() updateStatusDto: UpdateCollectionStatusDto,
  ) {
    // 1. Vérification de l'existence de la demande
    const request = await this.collectionRequestsService.findOne(collectionId);
    if (!request) {
      throw new NotFoundException('Demande non trouvée');
    }

    this.logger.log(`Tentative de mise à jour du statut de la demande ${collectionId} par le pré-collecteur ${preCollectorId}`);

    // 2. Vérification des droits du pré-collecteur
    if (request.preCollectorId !== preCollectorId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette demande');
    }
    
    // 3. Vérification de la validité de la transition
    const isValidTransition = this.isValidStatusTransition(request.status, updateStatusDto.status);
    if (!isValidTransition) {
      throw new BadRequestException('Transition de statut non autorisée');
    }

    // 4. Mise à jour du statut
    return this.collectionRequestsService.updateStatus(collectionId, preCollectorId, updateStatusDto);
  }

  // Obtenir les détails d'une demande
  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'une demande de collecte' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    const request = await this.collectionRequestsService.findOne(id);
    if (!request) {
      throw new NotFoundException('Demande non trouvée');
    }
    return request;
  }

  // Vérification des transitions de statut valides
  private isValidStatusTransition(currentStatus: CollectionStatus, newStatus: CollectionStatus): boolean {
    const transitions: Record<CollectionStatus, CollectionStatus[]> = {
      [CollectionStatus.PENDING]: [CollectionStatus.ACCEPTED, CollectionStatus.REJECTED],
      [CollectionStatus.ACCEPTED]: [CollectionStatus.IN_PROGRESS, CollectionStatus.CANCELLED],
      [CollectionStatus.IN_PROGRESS]: [CollectionStatus.COMPLETED, CollectionStatus.CANCELLED],
      [CollectionStatus.COMPLETED]: [], // Aucune transition possible après COMPLETED
      [CollectionStatus.REJECTED]: [], // Aucune transition possible après REJECTED
      [CollectionStatus.CANCELLED]: [], // Aucune transition possible après CANCELLED
    };

    return transitions[currentStatus]?.includes(newStatus) ?? false;
  }
}
