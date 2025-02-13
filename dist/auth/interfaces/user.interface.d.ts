import { UserType, PointCategory } from '@prisma/client';
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    type: UserType;
    latitude: number | null;
    longitude: number | null;
    category: PointCategory | null;
    createdAt: Date;
    updatedAt: Date;
    activeLocation?: {
        id: string;
        latitude: number;
        longitude: number;
        updatedAt: Date;
    } | null;
}
