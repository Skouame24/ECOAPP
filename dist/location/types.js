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
exports.CollectorWithDistance = void 0;
const swagger_1 = require("@nestjs/swagger");
class CollectorWithDistance {
}
exports.CollectorWithDistance = CollectorWithDistance;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Identifiant unique du collecteur' }),
    __metadata("design:type", String)
], CollectorWithDistance.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Prénom du collecteur' }),
    __metadata("design:type", String)
], CollectorWithDistance.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nom du collecteur' }),
    __metadata("design:type", String)
], CollectorWithDistance.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Numéro de téléphone du collecteur' }),
    __metadata("design:type", String)
], CollectorWithDistance.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude de la position du collecteur' }),
    __metadata("design:type", Number)
], CollectorWithDistance.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude de la position du collecteur' }),
    __metadata("design:type", Number)
], CollectorWithDistance.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Distance en kilomètres entre le collecteur et le point de recherche' }),
    __metadata("design:type", Number)
], CollectorWithDistance.prototype, "distance", void 0);
//# sourceMappingURL=types.js.map