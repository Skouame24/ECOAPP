import { PrismaService } from '../prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationService {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService);
    updateLocation(preCollectorId: string, updateLocationDto: UpdateLocationDto): Promise<{
        latitude: number;
        longitude: number;
        id: string;
        updatedAt: Date;
        preCollectorId: string;
    }>;
    getActiveLocation(preCollectorId: string): Promise<{
        latitude: number;
        longitude: number;
        id: string;
        updatedAt: Date;
        preCollectorId: string;
    } | null>;
}
