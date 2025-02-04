"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionRequestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CollectionRequestsService = class CollectionRequestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clientId, createCollectionRequestDto) {
        if (!clientId) {
            throw new common_1.BadRequestException('ID client non fourni');
        }
        const client = await this.prisma.user.findFirst({
            where: {
                id: clientId,
                type: client_1.UserType.CLIENT
            }
        });
        if (!client) {
            throw new common_1.NotFoundException('Client non trouvé');
        }
        if (createCollectionRequestDto.preCollectorId) {
            const preCollector = await this.prisma.user.findFirst({
                where: {
                    id: createCollectionRequestDto.preCollectorId,
                    type: client_1.UserType.PRE_COLLECTOR
                }
            });
            if (!preCollector) {
                throw new common_1.BadRequestException('Pré-collecteur invalide');
            }
        }
        return this.prisma.collectionRequest.create({
            data: {
                clientId,
                preCollectorId: createCollectionRequestDto.preCollectorId,
                wasteType: createCollectionRequestDto.wasteType,
                weight: createCollectionRequestDto.weight,
                price: createCollectionRequestDto.price,
                pickupLatitude: createCollectionRequestDto.pickupLatitude,
                pickupLongitude: createCollectionRequestDto.pickupLongitude,
                status: client_1.CollectionStatus.PENDING,
            },
            include: {
                client: true,
                preCollector: true
            },
        });
    }
    async findOne(id) {
        if (!id) {
            throw new common_1.BadRequestException('ID de la demande non fourni');
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
            throw new common_1.NotFoundException('Demande de collecte non trouvée');
        }
        return request;
    }
    async findAllByClient(clientId) {
        if (!clientId) {
            throw new common_1.BadRequestException('ID client non fourni');
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
    async findAllByPreCollector(preCollectorId) {
        if (!preCollectorId) {
            throw new common_1.BadRequestException('ID pré-collecteur non fourni');
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
    async findNearbyRequests(latitude, longitude, radiusInKm = 5) {
        if (!latitude || !longitude) {
            throw new common_1.BadRequestException('Latitude et longitude requises');
        }
        const nearbyRequests = await this.prisma.$queryRaw `
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
    async updateStatus(collectionId, preCollectorId, updateStatusDto) {
        if (!collectionId || !preCollectorId) {
            throw new common_1.BadRequestException('ID de la demande et ID du pré-collecteur requis');
        }
        const request = await this.findOne(collectionId);
        if (!request) {
            throw new common_1.NotFoundException('Demande de collecte non trouvée');
        }
        if (request.preCollectorId !== preCollectorId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à modifier cette demande');
        }
        this.validateStatusTransition(request.status, updateStatusDto.status);
        const updatedRequest = await this.prisma.collectionRequest.update({
            where: { id: collectionId },
            data: {
                status: updateStatusDto.status,
                ...(updateStatusDto.status === client_1.CollectionStatus.COMPLETED ? { validatedAt: new Date() } : {}),
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
    validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            [client_1.CollectionStatus.PENDING]: [client_1.CollectionStatus.ACCEPTED, client_1.CollectionStatus.REJECTED],
            [client_1.CollectionStatus.ACCEPTED]: [client_1.CollectionStatus.IN_PROGRESS, client_1.CollectionStatus.CANCELLED],
            [client_1.CollectionStatus.IN_PROGRESS]: [client_1.CollectionStatus.COMPLETED, client_1.CollectionStatus.CANCELLED],
            [client_1.CollectionStatus.COMPLETED]: [],
            [client_1.CollectionStatus.REJECTED]: [],
            [client_1.CollectionStatus.CANCELLED]: [],
        };
        if (!validTransitions[currentStatus].includes(newStatus)) {
            throw new common_1.BadRequestException(`Transition de statut invalide de ${currentStatus} vers ${newStatus}`);
        }
    }
};
exports.CollectionRequestsService = CollectionRequestsService;
exports.CollectionRequestsService = CollectionRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollectionRequestsService);
//# sourceMappingURL=collection-requests.service.js.map