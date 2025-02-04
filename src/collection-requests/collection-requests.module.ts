import { Module } from '@nestjs/common';
import { CollectionRequestsService } from './collection-requests.service';
import { CollectionRequestsController } from './collection-requests.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CollectionRequestsController],
  providers: [CollectionRequestsService, PrismaService],
  exports: [CollectionRequestsService],
})
export class CollectionRequestsModule {}