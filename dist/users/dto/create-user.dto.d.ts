import { UserType, PointCategory } from '@prisma/client';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    type: UserType;
    latitude?: number;
    longitude?: number;
    category?: PointCategory;
}
