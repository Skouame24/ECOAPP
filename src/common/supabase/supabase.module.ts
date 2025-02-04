import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { SupabaseGuard } from './supabase.guard';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  providers: [SupabaseService, SupabaseStrategy, SupabaseGuard],
  exports: [SupabaseService, SupabaseStrategy, SupabaseGuard],
})
export class SupabaseModule {}