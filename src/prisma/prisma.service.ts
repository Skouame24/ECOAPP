import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
    } catch (error) {
      console.error('Error running prisma generate:', error);
    }
    await this.$connect();
  }
}
