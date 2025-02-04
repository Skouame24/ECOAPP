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
const supabase_js_1 = require("@supabase/supabase-js");
let LocationService = class LocationService {
    constructor(prisma) {
        this.prisma = prisma;
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY sont nécessaires');
        }
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
    }
    async updateLocation(preCollectorId, updateLocationDto) {
        const activeLocation = await this.prisma.preCollectorLocation.upsert({
            where: { preCollectorId },
            update: {
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
            create: {
                preCollectorId,
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
        });
        await this.prisma.preCollectorLocationHistory.create({
            data: {
                preCollectorId,
                latitude: updateLocationDto.latitude,
                longitude: updateLocationDto.longitude,
            },
        });
        await this.supabase
            .from('pre_collector_locations')
            .upsert({
            pre_collector_id: preCollectorId,
            latitude: updateLocationDto.latitude,
            longitude: updateLocationDto.longitude,
            updated_at: new Date().toISOString(),
        });
        return activeLocation;
    }
    async getActiveLocation(preCollectorId) {
        return this.prisma.preCollectorLocation.findUnique({
            where: { preCollectorId },
        });
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocationService);
//# sourceMappingURL=location.service.js.map