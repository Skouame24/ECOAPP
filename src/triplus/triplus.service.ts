import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTriPlusDto } from './dto/create-triplus.dto';

@Injectable()
export class TriPlusService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      console.log('Fetching all tri+ information');
      const triInfos = await this.prisma.triPlus.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(`Found ${triInfos.length} tri+ information entries`);
      return triInfos;
    } catch (error) {
      console.error('Error fetching tri+ information:', error);
      throw new InternalServerErrorException('Failed to fetch tri+ information');
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Fetching tri+ information with id: ${id}`);
      const triInfo = await this.prisma.triPlus.findUnique({
        where: { id },
      });

      if (!triInfo) {
        console.log(`No tri+ information found with id: ${id}`);
        throw new NotFoundException('Information de tri non trouvée');
      }

      console.log('Tri+ information found:', triInfo);
      return triInfo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching tri+ information:', error);
      throw new InternalServerErrorException('Failed to fetch tri+ information');
    }
  }

  async create(createTriPlusDto: CreateTriPlusDto) {
    try {
      console.log('Creating new tri+ information with data:', createTriPlusDto);
      const triInfo = await this.prisma.triPlus.create({
        data: {
          title: createTriPlusDto.title,
          content: createTriPlusDto.content,
        },
      });
      console.log('Tri+ information created successfully:', triInfo);
      return triInfo;
    } catch (error) {
      console.error('Error creating tri+ information:', error);
      throw new InternalServerErrorException('Failed to create tri+ information');
    }
  }
}