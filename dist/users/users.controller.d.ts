import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
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
    }>;
    findAllClients(): Promise<{
        type: import(".prisma/client").$Enums.UserType;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
    }[]>;
    findAllPreCollectors(): Promise<{
        type: import(".prisma/client").$Enums.UserType;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
    }[]>;
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
    }>;
    updateLocation(id: string, updateLocationDto: UpdateLocationDto): Promise<{
        latitude: number;
        longitude: number;
        id: string;
        updatedAt: Date;
        preCollectorId: string;
    }>;
    getUserLocations(id: string): Promise<{
        activeLocation: {
            latitude: number;
            longitude: number;
            id: string;
            updatedAt: Date;
            preCollectorId: string;
        } | null;
        locationHistory: {
            latitude: number;
            longitude: number;
            id: string;
            createdAt: Date;
            preCollectorId: string;
        }[];
    }>;
    findNearbyCollectors(latitude: number, longitude: number, radius?: number): Promise<unknown>;
}
