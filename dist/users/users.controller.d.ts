import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    private readonly logger;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
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
        category: import(".prisma/client").$Enums.PointCategory | null;
        activeLocation: {
            latitude: number;
            longitude: number;
            id: string;
            updatedAt: Date;
            preCollectorId: string;
        } | null;
    }>;
    findAllClients(): Promise<({
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: import(".prisma/client").$Enums.UserType;
        category: import(".prisma/client").$Enums.PointCategory | null;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
    } | {
        activeLocation: {
            id: string;
            latitude: number;
            longitude: number;
            updatedAt: Date;
        } | null;
        locationHistory: {
            id: string;
            latitude: number;
            longitude: number;
            createdAt: Date;
        }[];
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: import(".prisma/client").$Enums.UserType;
        category: import(".prisma/client").$Enums.PointCategory | null;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
    })[]>;
    findAllPreCollectors(): Promise<({
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: import(".prisma/client").$Enums.UserType;
        category: import(".prisma/client").$Enums.PointCategory | null;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
    } | {
        activeLocation: {
            id: string;
            latitude: number;
            longitude: number;
            updatedAt: Date;
        } | null;
        locationHistory: {
            id: string;
            latitude: number;
            longitude: number;
            createdAt: Date;
        }[];
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        type: import(".prisma/client").$Enums.UserType;
        category: import(".prisma/client").$Enums.PointCategory | null;
        createdAt: Date;
        updatedAt: Date;
        latitude: number | null;
        longitude: number | null;
    })[]>;
    findOne(id: string): Promise<{
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
        category: import(".prisma/client").$Enums.PointCategory | null;
        activeLocation: {
            latitude: number;
            longitude: number;
            updatedAt: Date;
        } | null;
        locationHistory: {
            latitude: number;
            longitude: number;
            createdAt: Date;
        }[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
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
        category: import(".prisma/client").$Enums.PointCategory | null;
        activeLocation: {
            latitude: number;
            longitude: number;
            id: string;
            updatedAt: Date;
            preCollectorId: string;
        } | null;
    }>;
    findNearbyCollectors(latitude: number, longitude: number, radius?: number): Promise<unknown>;
}
