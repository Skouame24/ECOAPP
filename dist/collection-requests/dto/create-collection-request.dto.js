"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCollectionRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateCollectionRequestDto {
}
exports.CreateCollectionRequestDto = CreateCollectionRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.WasteType, description: 'Type de déchet' }),
    (0, class_validator_1.IsEnum)(client_1.WasteType),
    __metadata("design:type", String)
], CreateCollectionRequestDto.prototype, "wasteType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Poids des déchets en kg' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCollectionRequestDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prix proposé' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateCollectionRequestDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude du point de collecte' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCollectionRequestDto.prototype, "pickupLatitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude du point de collecte' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCollectionRequestDto.prototype, "pickupLongitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du pré-collecteur choisi', required: false }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCollectionRequestDto.prototype, "preCollectorId", void 0);
//# sourceMappingURL=create-collection-request.dto.js.map