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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Supabase_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Supabase = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const supabase_js_1 = require("@supabase/supabase-js");
const passport_jwt_1 = require("passport-jwt");
let Supabase = Supabase_1 = class Supabase {
    constructor(request, configService) {
        this.request = request;
        this.configService = configService;
        this.logger = new common_1.Logger(Supabase_1.name);
    }
    getClient() {
        if (this.clientInstance) {
            return this.clientInstance;
        }
        const supabaseUrl = this.configService.get('SUPABASE_URL');
        const supabaseAnonKey = this.configService.get('SUPABASE_ANON_KEY');
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase credentials are not properly configured');
        }
        this.clientInstance = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey, {
            auth: {
                autoRefreshToken: true,
                detectSessionInUrl: false,
            },
        });
        const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()(this.request);
        if (token) {
            this.clientInstance.auth.setSession({
                access_token: token,
                refresh_token: '',
            });
        }
        return this.clientInstance;
    }
};
exports.Supabase = Supabase;
exports.Supabase = Supabase = Supabase_1 = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.REQUEST }),
    __param(0, (0, common_1.Inject)(core_1.REQUEST)),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], Supabase);
//# sourceMappingURL=supabase.js.map