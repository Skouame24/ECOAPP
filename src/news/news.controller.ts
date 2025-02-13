import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { NewsDto } from './dto/news.dto';
import { CreateNewsDto } from './dto/create-news.dto';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des actualités' })
  @ApiResponse({ status: 200, description: 'Liste des actualités', type: [NewsDto] })
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un article' })
  @ApiResponse({ status: 200, description: 'Détails de l\'article', type: NewsDto })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle actualité' })
  @ApiResponse({ status: 201, description: 'Actualité créée', type: NewsDto })
  async create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }
}