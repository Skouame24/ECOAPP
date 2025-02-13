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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_responses_1 = require("./responses/user.responses");
const create_user_dto_1 = require("./dto/create-user.dto");
const client_1 = require("@prisma/client");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_1.Logger(users_service_1.UsersService.name);
    }
    async create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    async findAllClients() {
        return this.usersService.findAllUsers(client_1.UserType.CLIENT);
    }
    async findAllPreCollectors() {
        this.logger.debug('Début findAllPreCollectors');
        try {
            const result = await this.usersService.findAllUsers(client_1.UserType.PRE_COLLECTOR);
            this.logger.debug(`Résultat findAllPreCollectors: ${JSON.stringify(result)}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Erreur dans findAllPreCollectors: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        return this.usersService.findById(id);
    }
    async update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    async findNearbyCollectors(latitude, longitude, radius) {
        return this.usersService.findNearbyPreCollectors(latitude, longitude, radius);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouvel utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Utilisateur créé avec succès', type: user_responses_1.UserResponse }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email déjà utilisé' }),
    (0, swagger_1.ApiBody)({ type: create_user_dto_1.CreateUserDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('clients'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtenir la liste de tous les clients" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Liste des clients", type: [user_responses_1.UserResponse] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllClients", null);
__decorate([
    (0, common_1.Get)('precollectors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Obtenir la liste de tous les pré-collecteurs" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Liste des pré-collecteurs", type: [user_responses_1.PreCollectorResponse] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllPreCollectors", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'un utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Détails de l\'utilisateur', type: user_responses_1.UserResponse }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Utilisateur mis à jour avec succès', type: user_responses_1.UserResponse }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('nearby/collectors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Trouver les pré-collecteurs à proximité' }),
    (0, swagger_1.ApiQuery)({ name: 'latitude', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'longitude', type: Number, required: true }),
    (0, swagger_1.ApiQuery)({ name: 'radius', type: Number, required: false, description: 'Rayon en kilomètres (défaut: 5)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des pré-collecteurs à proximité', type: [user_responses_1.PreCollectorResponse] }),
    __param(0, (0, common_1.Query)('latitude')),
    __param(1, (0, common_1.Query)('longitude')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findNearbyCollectors", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map