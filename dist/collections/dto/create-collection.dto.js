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
exports.CreateCollectionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateCollectionDto {
}
exports.CreateCollectionDto = CreateCollectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: client_1.WasteType.ORGANIC }),
    (0, class_validator_1.IsEnum)(client_1.WasteType),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "wasteType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10.5 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.0 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 48.8566 }),
    (0, class_validator_1.IsLatitude)(),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2.3522 }),
    (0, class_validator_1.IsLongitude)(),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "longitude", void 0);
//# sourceMappingURL=create-collection.dto.js.map