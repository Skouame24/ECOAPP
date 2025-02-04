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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            const user = await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword,
                },
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
                    updatedAt: true,
                },
            });
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
                    latitude: true,
                    longitude: true,
                    createdAt: true,
                    updatedAt: true,
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
    async updateLocation(id, updateLocationDto) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { type: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        if (user.type !== client_1.UserType.PRE_COLLECTOR) {
            throw new common_1.BadRequestException('Seuls les pré-collecteurs peuvent mettre à jour leur position');
        }
        await this.prisma.user.update({
            where: { id },
            data: {
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
        });
        const activeLocation = await this.prisma.preCollectorLocation.upsert({
            where: { preCollectorId: id },
            update: {
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
            create: {
                preCollectorId: id,
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
        });
        await this.prisma.preCollectorLocationHistory.create({
            data: {
                preCollectorId: id,
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
        });
        return activeLocation;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
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
                latitude: true,
                longitude: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async getUserLocations(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                activeLocation: true,
                locationHistory: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 100
                }
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        if (user.type !== client_1.UserType.PRE_COLLECTOR) {
            throw new common_1.BadRequestException('Seuls les pré-collecteurs ont un historique de localisation');
        }
        return {
            activeLocation: user.activeLocation,
            locationHistory: user.locationHistory
        };
    }
    async findNearbyPreCollectors(latitude, longitude, radiusInKm = 5) {
        const preCollectors = await this.prisma.$queryRaw `
      WITH distances AS (
        SELECT 
          u.id,
          u."firstName",
          u."lastName",
          u."phoneNumber",
          u.latitude::float8,
          u.longitude::float8,
          (
            6371.0 * acos(
              cos(radians(${latitude}::float8)) * 
              cos(radians(u.latitude::float8)) * 
              cos(radians(u.longitude::float8) - radians(${longitude}::float8)) + 
              sin(radians(${latitude}::float8)) * 
              sin(radians(u.latitude::float8))
            )
          )::float8 as distance
        FROM users u
        WHERE u.type = 'PRE_COLLECTOR'
        AND u.latitude IS NOT NULL
        AND u.longitude IS NOT NULL
      )
      SELECT *
      FROM distances
      WHERE distance <= ${radiusInKm}::float8
      ORDER BY distance;
    `;
        return preCollectors;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map