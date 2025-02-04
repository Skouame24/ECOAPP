import { CollectionsService } from './collections.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Request as ExpressRequest } from 'express';
import { IUser } from '../auth/interfaces/user.interface';
interface AuthenticatedRequest extends ExpressRequest {
    user: IUser;
}
export declare class CollectionsController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    updateLocation(location: UpdateLocationDto, req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
    trackPreCollector(preCollectorId: string, clientLat?: number, clientLng?: number): Promise<{
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
    getLocationHistory(preCollectorId: string): Promise<any[]>;
}
export {};
