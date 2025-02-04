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
        type: request.user.type
    };
    if (data) {
        return user[data];
    }
    return user;
});
//# sourceMappingURL=user.decorator.js.map