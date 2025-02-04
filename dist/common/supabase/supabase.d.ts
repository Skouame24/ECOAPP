import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class Supabase {
    private readonly request;
    private readonly configService;
    private readonly logger;
    private clientInstance;
    constructor(request: Request, configService: ConfigService);
    getClient(): SupabaseClient<any, "public", any>;
}
