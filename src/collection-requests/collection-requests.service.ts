import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionRequestDto } from './dto/create-collection-request.dto';
import { UpdateCollectionStatusDto } from './dto/update-collection-status.dto';
import { CollectionStatus, UserType } from '@prisma/client';

@Injectable()
export class CollectionRequestsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, createCollectionRequestDto: CreateCollectionRequestDto) {
    if (!clientId) {
      throw new BadRequestException('ID client non fourni');
    }

    // Vérifier que l'utilisateur est bien un client avec tous les détails
    const client = await this.prisma.user.findFirst({
      where: {
        id: clientId,
        type: UserType.CLIENT
      }
    });

    if (!client) {
      throw new NotFoundException('Client non trouvé');
    }

    // Si un pré-collecteur est spécifié, vérifier qu'il existe et est bien un pré-collecteur
    if (createCollectionRequestDto.preCollectorId) {
      const preCollector = await this.prisma.user.findFirst({
        where: {
          id: createCollectionRequestDto.preCollectorId,
          type: UserType.PRE_COLLECTOR
        }
      });

      if (!preCollector) {
        throw new BadRequestException('Pré-collecteur invalide');
      }
    }

    // Créer la demande de collecte
    return this.prisma.collectionRequest.create({
      data: {
        clientId,
        preCollectorId: createCollectionRequestDto.preCollectorId,
        wasteType: createCollectionRequestDto.wasteType,
        weight: createCollectionRequestDto.weight,
        price: createCollectionRequestDto.price,
        pickupLatitude: createCollectionRequestDto.pickupLatitude,
        pickupLongitude: createCollectionRequestDto.pickupLongitude,
        status: CollectionStatus.PENDING,
      },
      include: {
        client: true,
        preCollector: true
      },
    });
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('ID de la demande non fourni');
    }

    const request = await this.prisma.collectionRequest.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
        preCollector: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
    });

    if (!request) {
      throw new NotFoundException('Demande de collecte non trouvée');
    }

    return request;
  }

  async findAllByClient(clientId: string) {
    if (!clientId) {
      throw new BadRequestException('ID client non fourni');
    }

    return this.prisma.collectionRequest.findMany({
      where: { clientId },
      include: {
        preCollector: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllByPreCollector(preCollectorId: string) {
    if (!preCollectorId) {
      throw new BadRequestException('ID pré-collecteur non fourni');
    }

    return this.prisma.collectionRequest.findMany({
      where: { preCollectorId },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findNearbyRequests(latitude: number, longitude: number, radiusInKm: number = 5) {
    if (!latitude || !longitude) {
      throw new BadRequestException('Latitude et longitude requises');
    }

    // Utiliser une requête SQL brute pour calculer la distance
    const nearbyRequests = await this.prisma.$queryRaw`
      WITH requests_with_distance AS (
        SELECT 
          cr.*,
          (
            6371.0 * acos(
              cos(radians(${latitude}::float8)) * 
              cos(radians(cr."pickupLatitude"::float8)) * 
              cos(radians(cr."pickupLongitude"::float8) - radians(${longitude}::float8)) + 
              sin(radians(${latitude}::float8)) * 
              sin(radians(cr."pickupLatitude"::float8))
            )
          )::float8 as distance
        FROM "collections" cr
        WHERE cr.status = 'PENDING'
        AND cr."preCollectorId" IS NULL
      )
      SELECT *,
        (SELECT row_to_json(u)
         FROM (
           SELECT 
             id, 
             email,
             "firstName", 
             "lastName", 
             "phoneNumber",
             type,
             latitude,
             longitude,
             "createdAt",
             "updatedAt"
           FROM users
           WHERE id = requests_with_distance."clientId"
         ) u
        ) as client
      FROM requests_with_distance
      WHERE distance <= ${radiusInKm}::float8
      ORDER BY distance;
    `;

    return nearbyRequests;
  }

  async updateStatus(collectionId: string, preCollectorId: string, updateStatusDto: UpdateCollectionStatusDto) {
    if (!collectionId || !preCollectorId) {
      throw new BadRequestException('ID de la demande et ID du pré-collecteur requis');
    }

    const request = await this.findOne(collectionId);

    if (!request) {
      throw new NotFoundException('Demande de collecte non trouvée');
    }

    // Vérifier que le pré-collecteur est bien assigné à cette demande
    if (request.preCollectorId !== preCollectorId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette demande');
    }

    // Vérifier la validité de la transition de statut
    this.validateStatusTransition(request.status, updateStatusDto.status);

    // Mettre à jour le statut
    const updatedRequest = await this.prisma.collectionRequest.update({
      where: { id: collectionId },
      data: {
        status: updateStatusDto.status,
        ...(updateStatusDto.status === CollectionStatus.COMPLETED ? { validatedAt: new Date() } : {}),
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
        preCollector: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            type: true,
            latitude: true,
            longitude: true,
            createdAt: true,
            updatedAt: true
          }
        },
      },
    });

    return updatedRequest;
  }

  private validateStatusTransition(currentStatus: CollectionStatus, newStatus: CollectionStatus) {
    const validTransitions: Record<CollectionStatus, CollectionStatus[]> = {
      [CollectionStatus.PENDING]: [CollectionStatus.ACCEPTED, CollectionStatus.REJECTED],
      [CollectionStatus.ACCEPTED]: [CollectionStatus.IN_PROGRESS, CollectionStatus.CANCELLED],
      [CollectionStatus.IN_PROGRESS]: [CollectionStatus.COMPLETED, CollectionStatus.CANCELLED],
      [CollectionStatus.COMPLETED]: [],
      [CollectionStatus.REJECTED]: [],
      [CollectionStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(`Transition de statut invalide de ${currentStatus} vers ${newStatus}`);
    }
  }
}