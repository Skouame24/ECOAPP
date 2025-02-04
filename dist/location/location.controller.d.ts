import { LocationService } from './location.service';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
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
