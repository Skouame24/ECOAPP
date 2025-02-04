import { LocationService } from './location.service';
import { CollectorWithDistance } from './types';
import { SearchCollectorDto } from './dto/search-collectors.dto';
export declare class LocationController {
    private readonly locationService;
    constructor(locationService: LocationService);
    findNearbyCollectors(searchParams: SearchCollectorDto): Promise<CollectorWithDistance[]>;
}
