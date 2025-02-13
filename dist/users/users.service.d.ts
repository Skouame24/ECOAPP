import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserType } from '@prisma/client';
export declare class UsersService {
    private prisma;
    private readonly logger;
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
        category: import(".prisma/client").$Enums.PointCategory | null;
        activeLocation: {
            latitude: number;
            longitude: number;
            id: string;
            updatedAt: Date;
            preCollectorId: string;
        } | null;
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
        category: import(".prisma/client").$Enums.PointCategory | null;
        activeLocation: {
            latitude: number;
            longitude: number;
            id: string;
            updatedAt: Date;
            preCollectorId: string;
        } | null;
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
    findAllUsers(type: UserType): Promise<({
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
    findNearbyPreCollectors(latitude: number, longitude: number, radiusInKm?: number): Promise<unknown>;
}
