import { UserType } from '@prisma/client';
import { UserProfile, UserLocation, UserLocationHistory } from '../types/user.types';
export declare class UserResponse implements Partial<UserProfile> {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    type: UserType;
    createdAt: Date;
    updatedAt: Date;
    latitude?: number | null;
    longitude?: number | null;
}
export declare class UserLocationResponse implements UserLocation {
    id: string;
    latitude: number;
    longitude: number;
    updatedAt: Date;
}
export declare class UserLocationHistoryResponse implements UserLocationHistory {
    id: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
}
