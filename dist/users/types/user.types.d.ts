import { UserType } from '@prisma/client';
export interface UserLocation {
    id: string;
    latitude: number;
    longitude: number;
    updatedAt: Date;
}
export interface UserLocationHistory {
    id: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
}
export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    type: UserType;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: Date;
    updatedAt: Date;
}
