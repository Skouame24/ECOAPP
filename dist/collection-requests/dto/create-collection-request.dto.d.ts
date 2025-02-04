import { WasteType } from '@prisma/client';
export declare class CreateCollectionRequestDto {
    wasteType: WasteType;
    weight: number;
    price: number;
    pickupLatitude: number;
    pickupLongitude: number;
    preCollectorId?: string;
}
