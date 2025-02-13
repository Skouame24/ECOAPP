import { CollectionRequestsService } from './collection-requests.service';
import { CreateCollectionRequestDto } from './dto/create-collection-request.dto';
import { UpdateCollectionStatusDto } from './dto/update-collection-status.dto';
export declare class CollectionRequestsController {
    private readonly collectionRequestsService;
    private readonly logger;
    constructor(collectionRequestsService: CollectionRequestsService);
    create(clientId: string, createCollectionRequestDto: CreateCollectionRequestDto): Promise<{
        preCollector: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            category: import(".prisma/client").$Enums.PointCategory | null;
        } | null;
        client: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
            category: import(".prisma/client").$Enums.PointCategory | null;
        };
    } & {
        id: string;
        createdAt: Date;
        preCollectorId: string | null;
        wasteType: import(".prisma/client").$Enums.WasteType;
        weight: number;
        price: number;
        status: import(".prisma/client").$Enums.CollectionStatus;
        pickupLatitude: number;
        pickupLongitude: number;
        validatedAt: Date | null;
        pointId: string | null;
        clientId: string;
    }>;
    getMe(userId: string): Promise<{
        userId: string;
    }>;
    findAllByClient(clientId: string): Promise<({
        preCollector: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        preCollectorId: string | null;
        wasteType: import(".prisma/client").$Enums.WasteType;
        weight: number;
        price: number;
        status: import(".prisma/client").$Enums.CollectionStatus;
        pickupLatitude: number;
        pickupLongitude: number;
        validatedAt: Date | null;
        pointId: string | null;
        clientId: string;
    })[]>;
    findAllByPreCollector(preCollectorId: string): Promise<({
        client: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        preCollectorId: string | null;
        wasteType: import(".prisma/client").$Enums.WasteType;
        weight: number;
        price: number;
        status: import(".prisma/client").$Enums.CollectionStatus;
        pickupLatitude: number;
        pickupLongitude: number;
        validatedAt: Date | null;
        pointId: string | null;
        clientId: string;
    })[]>;
    findNearbyRequests(latitude: number, longitude: number, radius?: number): Promise<unknown>;
    updateStatus(preCollectorId: string, collectionId: string, updateStatusDto: UpdateCollectionStatusDto): Promise<{
        preCollector: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        client: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        preCollectorId: string | null;
        wasteType: import(".prisma/client").$Enums.WasteType;
        weight: number;
        price: number;
        status: import(".prisma/client").$Enums.CollectionStatus;
        pickupLatitude: number;
        pickupLongitude: number;
        validatedAt: Date | null;
        pointId: string | null;
        clientId: string;
    }>;
    findOne(id: string): Promise<{
        preCollector: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        client: {
            type: import(".prisma/client").$Enums.UserType;
            latitude: number | null;
            longitude: number | null;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        preCollectorId: string | null;
        wasteType: import(".prisma/client").$Enums.WasteType;
        weight: number;
        price: number;
        status: import(".prisma/client").$Enums.CollectionStatus;
        pickupLatitude: number;
        pickupLongitude: number;
        validatedAt: Date | null;
        pointId: string | null;
        clientId: string;
    }>;
    private isValidStatusTransition;
}
