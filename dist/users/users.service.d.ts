import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserType } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findByEmail(email: string): Promise<{
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
    }>;
    findById(id: string): Promise<{
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
    findAllUsers(type: UserType): Promise<{
        type: import(".prisma/client").$Enums.UserType;
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        createdAt: Date;
    }[]>;
    findNearbyPreCollectors(latitude: number, longitude: number, radiusInKm?: number): Promise<unknown>;
}
