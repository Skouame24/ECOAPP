"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const collections_module_1 = require("./collections/collections.module");
const prisma_module_1 = require("./prisma/prisma.module");
const supabase_module_1 = require("./common/supabase/supabase.module");
const auth_module_1 = require("./auth/auth.module");
const location_module_1 = require("./location/location.module");
const collection_requests_module_1 = require("./collection-requests/collection-requests.module");
const users_module_1 = require("./users/users.module");
const news_module_1 = require("./news/news.module");
const triplus_module_1 = require("./triplus/triplus.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            passport_1.PassportModule,
            prisma_module_1.PrismaModule,
            supabase_module_1.SupabaseModule,
            users_module_1.UsersModule,
            collections_module_1.CollectionsModule,
            auth_module_1.AuthModule,
            location_module_1.LocationModule,
            collection_requests_module_1.CollectionRequestsModule,
            news_module_1.NewsModule,
            triplus_module_1.TriPlusModule
        ],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map