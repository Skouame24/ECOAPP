import { UserType } from '@prisma/client';
export declare class CollectorResponseDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    type: UserType;
    latitude: number | null;
    longitude: number | null;
    createdAt: Date;
    updatedAt: Date;
    distance: number;
}
