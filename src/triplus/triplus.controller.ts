import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TriPlusService } from './triplus.service';
import { TriPlusDto } from './dto/triplus.dto';
import { CreateTriPlusDto } from './dto/create-triplus.dto';

@ApiTags('triplus')
@Controller('triplus')
export class TriPlusController {
  constructor(private readonly triplusService: TriPlusService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir la liste des informations de tri' })
  @ApiResponse({ status: 200, description: 'Liste des informations de tri', type: [TriPlusDto] })
  findAll() {
    return this.triplusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'une information de tri' })
  @ApiResponse({ status: 200, description: 'Détails de l\'information de tri', type: TriPlusDto })
  @ApiResponse({ status: 404, description: 'Information non trouvée' })
  findOne(@Param('id') id: string) {
    return this.triplusService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle information de tri' })
  @ApiResponse({ status: 201, description: 'Information de tri créée', type: TriPlusDto })
  async create(@Body() createTriPlusDto: CreateTriPlusDto) {
    return this.triplusService.create(createTriPlusDto);
  }
}