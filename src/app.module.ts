import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CollectionsModule } from './collections/collections.module';
import { PrismaModule } from './prisma/prisma.module';
import { SupabaseModule } from './common/supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { LocationModule } from './location/location.module';
import { CollectionRequestsModule } from './collection-requests/collection-requests.module';
import { UsersModule } from './users/users.module';
import { NewsModule } from './news/news.module';
import { TriPlusModule } from './triplus/triplus.module';

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
    NewsModule,
    TriPlusModule
  ],
  providers: [],
})
export class AppModule {}