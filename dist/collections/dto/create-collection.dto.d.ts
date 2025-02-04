import { WasteType } from '@prisma/client';
export declare class CreateCollectionDto {
    wasteType: WasteType;
    weight: number;
    price: number;
    latitude: number;
    longitude: number;
}
