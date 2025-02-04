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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_service_1 = require("../common/supabase/supabase.service");
const client_1 = require("@prisma/client");
let CollectionsService = class CollectionsService {
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    estimateArrivalTime(distance) {
        const averageSpeed = 30;
        return Math.round((distance / averageSpeed) * 60);
    }
    async updatePreCollectorLocation(preCollectorId, location) {
        const user = await this.prisma.user.findUnique({
            where: { id: preCollectorId },
        });
        if (!user) {
            throw new common_1.NotFoundException('Pré-collecteur non trouvé');
        }
        if (user.type !== client_1.UserType.PRE_COLLECTOR) {
            throw new common_1.ForbiddenException('Seuls les pré-collecteurs peuvent mettre à jour leur position');
        }
        const { error } = await this.supabase.getClient()
            .from('pre_collector_locations')
            .upsert({
            pre_collector_id: preCollectorId,
            latitude: location.latitude,
            longitude: location.longitude,
            updated_at: new Date().toISOString()
        });
        if (error) {
            throw new Error('Erreur lors de la mise à jour de la position');
        }
        return { message: 'Position mise à jour avec succès' };
    }
    async getPreCollectorLocation(preCollectorId, clientLocation) {
        const user = await this.prisma.user.findUnique({
            where: { id: preCollectorId },
        });
        if (!user || user.type !== client_1.UserType.PRE_COLLECTOR) {
            throw new common_1.NotFoundException('Pré-collecteur non trouvé');
        }
        const { data: location, error } = await this.supabase.getClient()
            .from('pre_collector_locations')
            .select('*')
            .eq('pre_collector_id', preCollectorId)
            .single();
        if (error || !location) {
            throw new common_1.NotFoundException('Position non disponible');
        }
        if (clientLocation) {
            const distance = this.calculateDistance(location.latitude, location.longitude, clientLocation.latitude, clientLocation.longitude);
            const estimatedTime = this.estimateArrivalTime(distance);
            return {
                latitude: location.latitude,
                longitude: location.longitude,
                updated_at: location.updated_at,
                distance: Math.round(distance * 100) / 100,
                estimatedArrivalTime: estimatedTime,
            };
        }
        return {
            latitude: location.latitude,
            longitude: location.longitude,
            updated_at: location.updated_at,
        };
    }
    async subscribeToLocation(preCollectorId) {
        return this.supabase.getClient()
            .channel('pre_collector_location')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'pre_collector_locations',
            filter: `pre_collector_id=eq.${preCollectorId}`,
        }, (payload) => {
            return payload.new;
        })
            .subscribe();
    }
    async getLocationHistory(preCollectorId) {
        const user = await this.prisma.user.findUnique({
            where: { id: preCollectorId },
        });
        if (!user || user.type !== client_1.UserType.PRE_COLLECTOR) {
            throw new common_1.NotFoundException('Pré-collecteur non trouvé');
        }
        const { data: history, error } = await this.supabase.getClient()
            .from('pre_collector_location_history')
            .select('*')
            .eq('pre_collector_id', preCollectorId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error('Erreur lors de la récupération de l\'historique');
        }
        return history;
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        supabase_service_1.SupabaseService])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map