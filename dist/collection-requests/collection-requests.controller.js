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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CollectionRequestsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionRequestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const collection_requests_service_1 = require("./collection-requests.service");
const create_collection_request_dto_1 = require("./dto/create-collection-request.dto");
const update_collection_status_dto_1 = require("./dto/update-collection-status.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../users/decorator/user.decorator");
const client_1 = require("@prisma/client");
const common_2 = require("@nestjs/common");
let CollectionRequestsController = CollectionRequestsController_1 = class CollectionRequestsController {
    constructor(collectionRequestsService) {
        this.collectionRequestsService = collectionRequestsService;
        this.logger = new common_2.Logger(CollectionRequestsController_1.name);
    }
    async create(clientId, createCollectionRequestDto) {
        if (!createCollectionRequestDto.wasteType || !createCollectionRequestDto.weight || !createCollectionRequestDto.price) {
            throw new common_1.BadRequestException('Tous les champs sont requis');
        }
        return this.collectionRequestsService.create(clientId, createCollectionRequestDto);
    }
    async getMe(userId) {
        return { userId };
    }
    async findAllByClient(clientId) {
        return this.collectionRequestsService.findAllByClient(clientId);
    }
    async findAllByPreCollector(preCollectorId) {
        this.logger.log(`Récupération des demandes de collecte pour le pré-collecteur ${preCollectorId}`);
        const requests = await this.collectionRequestsService.findAllByPreCollector(preCollectorId);
        this.logger.log(`Demandes récupérées pour ${preCollectorId}: ${JSON.stringify(requests)}`);
        return requests;
    }
    async findNearbyRequests(latitude, longitude, radius = 5) {
        if (!latitude || !longitude) {
            throw new common_1.BadRequestException('Les coordonnées sont requises');
        }
        return this.collectionRequestsService.findNearbyRequests(latitude, longitude, radius);
    }
    async updateStatus(preCollectorId, collectionId, updateStatusDto) {
        const request = await this.collectionRequestsService.findOne(collectionId);
        if (!request) {
            throw new common_1.NotFoundException('Demande non trouvée');
        }
        this.logger.log(`Tentative de mise à jour du statut de la demande ${collectionId} par le pré-collecteur ${preCollectorId}`);
        if (request.preCollectorId !== preCollectorId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas autorisé à modifier cette demande');
        }
        this.logger.log(`Tentative de mise à jour du statut  ${(request.preCollectorId)} `);
        const isValidTransition = this.isValidStatusTransition(request.status, updateStatusDto.status);
        if (!isValidTransition) {
            throw new common_1.BadRequestException('Transition de statut non autorisée');
        }
        return this.collectionRequestsService.updateStatus(collectionId, preCollectorId, updateStatusDto);
    }
    async findOne(id) {
        const request = await this.collectionRequestsService.findOne(id);
        if (!request) {
            throw new common_1.NotFoundException('Demande non trouvée');
        }
        return request;
    }
    isValidStatusTransition(currentStatus, newStatus) {
        const transitions = {
            [client_1.CollectionStatus.PENDING]: [client_1.CollectionStatus.ACCEPTED, client_1.CollectionStatus.REJECTED],
            [client_1.CollectionStatus.ACCEPTED]: [client_1.CollectionStatus.IN_PROGRESS, client_1.CollectionStatus.CANCELLED],
            [client_1.CollectionStatus.IN_PROGRESS]: [client_1.CollectionStatus.COMPLETED, client_1.CollectionStatus.CANCELLED],
            [client_1.CollectionStatus.COMPLETED]: [],
            [client_1.CollectionStatus.REJECTED]: [],
            [client_1.CollectionStatus.CANCELLED]: [],
        };
        return transitions[currentStatus]?.includes(newStatus) ?? false;
    }
};
exports.CollectionRequestsController = CollectionRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle demande de collecte' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Demande créée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_collection_request_dto_1.CreateCollectionRequestDto]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir l\'ID de l\'utilisateur connecté' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "getMe", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir toutes les demandes de collecte du client' }),
    __param(0, (0, user_decorator_1.User)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "findAllByClient", null);
__decorate([
    (0, common_1.Get)('pre-collector/:preCollectorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir toutes les demandes de collecte pour un pré-collecteur' }),
    (0, swagger_1.ApiParam)({ name: 'preCollectorId', type: String }),
    __param(0, (0, common_1.Param)('preCollectorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "findAllByPreCollector", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les demandes de collecte à proximité' }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "findNearbyRequests", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut d\'une demande de collecte' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut mis à jour avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Statut invalide ou transition non autorisée' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès non autorisé' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Demande non trouvée' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiBody)({ type: update_collection_status_dto_1.UpdateCollectionStatusDto }),
    __param(0, (0, user_decorator_1.User)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_collection_status_dto_1.UpdateCollectionStatusDto]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'une demande de collecte' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CollectionRequestsController.prototype, "findOne", null);
exports.CollectionRequestsController = CollectionRequestsController = CollectionRequestsController_1 = __decorate([
    (0, swagger_1.ApiTags)('collection-requests'),
    (0, common_1.Controller)('collection-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [collection_requests_service_1.CollectionRequestsService])
], CollectionRequestsController);
//# sourceMappingURL=collection-requests.controller.js.map