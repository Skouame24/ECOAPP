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
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let LocationService = class LocationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findNearbyCollectors(searchDto) {
        const lat = Number(searchDto.latitude);
        const lon = Number(searchDto.longitude);
        const radius = Number(searchDto.radius);
        const radiusInDegrees = radius / 111;
        const minLat = lat - radiusInDegrees;
        const maxLat = lat + radiusInDegrees;
        const minLon = lon - radiusInDegrees;
        const maxLon = lon + radiusInDegrees;
        const collectors = await this.prisma.user.findMany({
            where: {
                type: client_1.UserType.PRE_COLLECTOR,
                activeLocation: {
                    AND: [
                        {
                            latitude: {
                                gte: minLat,
                                lte: maxLat
                            }
                        },
                        {
                            longitude: {
                                gte: minLon,
                                lte: maxLon
                            }
                        }
                    ]
                }
            },
            include: {
                activeLocation: true
            }
        });
        return collectors
            .filter(collector => {
            const location = collector.activeLocation;
            if (!location)
                return false;
            const distance = this.calculateDistance(lat, lon, location.latitude, location.longitude);
            return distance <= radius;
        })
            .map(collector => ({
            id: collector.id,
            firstName: collector.firstName,
            lastName: collector.lastName,
            phoneNumber: collector.phoneNumber,
            latitude: collector.activeLocation.latitude,
            longitude: collector.activeLocation.longitude,
            distance: this.calculateDistance(lat, lon, collector.activeLocation.latitude, collector.activeLocation.longitude)
        }));
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationService);
//# sourceMappingURL=location.service.js.map