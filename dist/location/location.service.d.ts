import { PrismaService } from '../prisma/prisma.service';
import { SearchCollectorDto } from './dto/search-collectors.dto';
import { CollectorWithDistance } from './types';
export declare class LocationService {
    private prisma;
    constructor(prisma: PrismaService);
    findNearbyCollectors(searchDto: SearchCollectorDto): Promise<CollectorWithDistance[]>;
    private calculateDistance;
    private toRad;
}
