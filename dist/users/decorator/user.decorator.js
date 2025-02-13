"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) {
        return null;
    }
    const user = {
        ...request.user,
        id: request.user.sub,
        sub: request.user.sub,
        email: request.user.email,
        firstName: request.user.firstName,
        lastName: request.user.lastName,
        phoneNumber: request.user.phoneNumber,
        type: request.user.type,
        category: request.user.category,
        latitude: request.user.latitude,
        longitude: request.user.longitude,
        createdAt: request.user.createdAt,
        updatedAt: request.user.updatedAt
    };
    if (data) {
        return user[data];
    }
    return user;
});
//# sourceMappingURL=user.decorator.js.map