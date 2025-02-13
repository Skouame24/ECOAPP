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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async create(createUserDto) {
        try {
            if (createUserDto.type === client_1.UserType.PRE_COLLECTOR && !createUserDto.category) {
                throw new common_1.BadRequestException('La catégorie est requise pour les pré-collecteurs');
            }
            if (createUserDto.type === client_1.UserType.CLIENT && createUserDto.category) {
                throw new common_1.BadRequestException('La catégorie ne peut être définie que pour les pré-collecteurs');
            }
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    firstName: createUserDto.firstName,
                    lastName: createUserDto.lastName,
                    email: createUserDto.email,
                    password: hashedPassword,
                    phoneNumber: createUserDto.phoneNumber,
                    type: createUserDto.type,
                    category: createUserDto.type === client_1.UserType.PRE_COLLECTOR ? createUserDto.category : undefined,
                    latitude: createUserDto.latitude,
                    longitude: createUserDto.longitude,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    type: true,
                    category: true,
                    latitude: true,
                    longitude: true,
                    createdAt: true,
                    updatedAt: true,
                    activeLocation: true,
                },
            });
            if (user.type === client_1.UserType.PRE_COLLECTOR && createUserDto.latitude && createUserDto.longitude) {
                await this.prisma.preCollectorLocation.create({
                    data: {
                        preCollectorId: user.id,
                        latitude: createUserDto.latitude,
                        longitude: createUserDto.longitude,
                    },
                });
                await this.prisma.preCollectorLocationHistory.create({
                    data: {
                        preCollectorId: user.id,
                        latitude: createUserDto.latitude,
                        longitude: createUserDto.longitude,
                    },
                });
            }
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Cet email est déjà utilisé');
                }
            }
            throw error;
        }
    }
    async update(id, updateUserDto) {
        try {
            const data = { ...updateUserDto };
            if (updateUserDto.password) {
                data.password = await bcrypt.hash(updateUserDto.password, 10);
            }
            const user = await this.prisma.user.update({
                where: { id },
                data,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    phoneNumber: true,
                    type: true,
                    category: true,
                    latitude: true,
                    longitude: true,
                    createdAt: true,
                    updatedAt: true,
                    activeLocation: true,
                },
            });
            return user;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException('Utilisateur non trouvé');
                }
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Cet email est déjà utilisé');
                }
            }
            throw error;
        }
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                type: true,
                category: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
                activeLocation: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phoneNumber: true,
                type: true,
                category: true,
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
                activeLocation: {
                    select: {
                        latitude: true,
                        longitude: true,
                        updatedAt: true,
                    }
                },
                locationHistory: {
                    select: {
                        latitude: true,
                        longitude: true,
                        createdAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 100
                }
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async findAllUsers(type) {
        try {
            this.logger.debug(`Début findAllUsers pour le type: ${type}`);
            const users = await this.prisma.user.findMany({
                where: { type },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneNumber: true,
                    type: true,
                    category: true,
                    latitude: true,
                    longitude: true,
                    createdAt: true,
                    updatedAt: true,
                    activeLocation: {
                        select: {
                            id: true,
                            latitude: true,
                            longitude: true,
                            updatedAt: true
                        }
                    },
                    locationHistory: {
                        select: {
                            id: true,
                            latitude: true,
                            longitude: true,
                            createdAt: true
                        },
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 10
                    }
                }
            });
            this.logger.debug(`Utilisateurs trouvés: ${JSON.stringify(users)}`);
            const mappedUsers = users.map(user => {
                const baseUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    type: user.type,
                    category: user.category,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    latitude: user.activeLocation?.latitude ?? user.latitude,
                    longitude: user.activeLocation?.longitude ?? user.longitude
                };
                if (type === client_1.UserType.PRE_COLLECTOR) {
                    return {
                        ...baseUser,
                        activeLocation: user.activeLocation ? {
                            id: user.activeLocation.id,
                            latitude: user.activeLocation.latitude,
                            longitude: user.activeLocation.longitude,
                            updatedAt: user.activeLocation.updatedAt
                        } : null,
                        locationHistory: user.locationHistory.map(location => ({
                            id: location.id,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            createdAt: location.createdAt
                        }))
                    };
                }
                return baseUser;
            });
            this.logger.debug(`Résultat final: ${JSON.stringify(mappedUsers)}`);
            return mappedUsers;
        }
        catch (error) {
            this.logger.error(`Erreur dans findAllUsers: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException('Erreur lors de la récupération des utilisateurs');
        }
    }
    async findNearbyPreCollectors(latitude, longitude, radiusInKm = 5) {
        const preCollectors = await this.prisma.$queryRaw `
      WITH distances AS (
        SELECT 
          u.id,
          u."firstName",
          u."lastName",
          u."phoneNumber",
          u.category,
          u.latitude::float8,
          u.longitude::float8,
          pcl.latitude as active_latitude,
          pcl.longitude as active_longitude,
          pcl."updatedAt" as location_updated_at,
          (
            6371.0 * acos(
              cos(radians(${latitude}::float8)) * 
              cos(radians(COALESCE(pcl.latitude, u.latitude)::float8)) * 
              cos(radians(COALESCE(pcl.longitude, u.longitude)::float8) - radians(${longitude}::float8)) + 
              sin(radians(${latitude}::float8)) * 
              sin(radians(COALESCE(pcl.latitude, u.latitude)::float8))
            )
          )::float8 as distance
        FROM users u
        LEFT JOIN pre_collector_locations pcl ON u.id = pcl."preCollectorId"
        WHERE u.type = 'PRE_COLLECTOR'
        AND (u.latitude IS NOT NULL OR pcl.latitude IS NOT NULL)
        AND (u.longitude IS NOT NULL OR pcl.longitude IS NOT NULL)
      )
      SELECT 
        id,
        "firstName",
        "lastName",
        "phoneNumber",
        category,
        COALESCE(active_latitude, latitude) as latitude,
        COALESCE(active_longitude, longitude) as longitude,
        location_updated_at,
        distance
      FROM distances
      WHERE distance <= ${radiusInKm}::float8
      ORDER BY distance;
    `;
        return preCollectors;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map