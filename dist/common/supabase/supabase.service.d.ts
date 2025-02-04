import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService implements OnModuleInit {
    private configService;
    private client;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    getClient(): SupabaseClient<any, "public", any>;
}
