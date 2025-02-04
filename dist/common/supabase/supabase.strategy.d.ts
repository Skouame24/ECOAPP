import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthUser } from '@supabase/supabase-js';
declare const SupabaseStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class SupabaseStrategy extends SupabaseStrategy_base {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    validate(payload: AuthUser): Promise<AuthUser>;
}
export {};
