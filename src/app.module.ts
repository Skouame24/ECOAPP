import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CollectionsModule } from './collections/collections.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseGuard } from './common/supabase/supabase.guard';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { CollectionRequestsModule } from './collection-requests/collection-requests.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    PrismaModule,
    SupabaseModule,
    UsersModule,
    CollectionsModule,
    AuthModule,
    LocationModule,
    CollectionRequestsModule,
  ],
  providers: [ ],
})
export class AppModule {}