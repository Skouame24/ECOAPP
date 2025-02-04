"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const supabase_strategy_1 = require("./supabase.strategy");
const supabase_guard_1 = require("./supabase.guard");
const supabase_service_1 = require("./supabase.service");
let SupabaseModule = class SupabaseModule {
};
exports.SupabaseModule = SupabaseModule;
exports.SupabaseModule = SupabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' })
        ],
        providers: [supabase_service_1.SupabaseService, supabase_strategy_1.SupabaseStrategy, supabase_guard_1.SupabaseGuard],
        exports: [supabase_service_1.SupabaseService, supabase_strategy_1.SupabaseStrategy, supabase_guard_1.SupabaseGuard],
    })
], SupabaseModule);
//# sourceMappingURL=supabase.module.js.map