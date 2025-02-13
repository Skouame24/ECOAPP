import { Module } from '@nestjs/common';
import { TriPlusController } from './triplus.controller';
import { TriPlusService } from './triplus.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TriPlusController],
  providers: [TriPlusService],
})
export class TriPlusModule {}