import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      console.log('Fetching all news articles');
      const articles = await this.prisma.news.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log(`Found ${articles.length} articles`);
      return articles;
    } catch (error) {
      console.error('Error fetching news articles:', error);
      throw new InternalServerErrorException('Failed to fetch news articles');
    }
  }

  async findOne(id: string) {
    try {
      console.log(`Fetching news article with id: ${id}`);
      const news = await this.prisma.news.findUnique({
        where: { id },
      });

      if (!news) {
        console.log(`No article found with id: ${id}`);
        throw new NotFoundException('Article non trouvé');
      }

      console.log('Article found:', news);
      return news;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching news article:', error);
      throw new InternalServerErrorException('Failed to fetch news article');
    }
  }

  async create(createNewsDto: CreateNewsDto) {
    try {
      console.log('Creating new article with data:', createNewsDto);
      const news = await this.prisma.news.create({
        data: {
          title: createNewsDto.title,
          content: createNewsDto.content,
        },
      });
      console.log('Article created successfully:', news);
      return news;
    } catch (error) {
      console.error('Error creating news article:', error);
      throw new InternalServerErrorException('Failed to create news article');
    }
  }
}