import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../common/supabase/supabase.service';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class CollectionsService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    private calculateDistance;
    private deg2rad;
    private estimateArrivalTime;
    updatePreCollectorLocation(preCollectorId: string, location: UpdateLocationDto): Promise<{
        message: string;
    }>;
    getPreCollectorLocation(preCollectorId: string, clientLocation?: {
        latitude: number;
        longitude: number;
    }): Promise<{
        latitude: any;
        longitude: any;
        updated_at: any;
        distance: number;
        estimatedArrivalTime: number;
    } | {
        latitude: any;
        longitude: any;
        updated_at: any;
        distance?: undefined;
        estimatedArrivalTime?: undefined;
    }>;
    subscribeToLocation(preCollectorId: string): Promise<import("@supabase/realtime-js").RealtimeChannel>;
    getLocationHistory(preCollectorId: string): Promise<any[]>;
}
