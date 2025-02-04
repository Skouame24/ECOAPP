import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch,
  Param, 
  UseGuards,
  Query 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiQuery 
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponse, UserLocationResponse } from './responses/user.responses';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les détails d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Détails de l\'utilisateur', type: UserResponse })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour la position d\'un pré-collecteur' })
  @ApiResponse({ status: 200, description: 'Position mise à jour avec succès', type: UserLocationResponse })
  @ApiResponse({ status: 400, description: 'Données invalides ou utilisateur non pré-collecteur' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return this.usersService.updateLocation(id, updateLocationDto);
  }

  @Get(':id/locations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir l\'historique des positions d\'un pré-collecteur' })
  @ApiResponse({ status: 200, description: 'Historique des positions', type: UserLocationResponse, isArray: true })
  @ApiResponse({ status: 400, description: 'Utilisateur non pré-collecteur' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getUserLocations(@Param('id') id: string) {
    return this.usersService.getUserLocations(id);
  }

  @Get('nearby/collectors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trouver les pré-collecteurs à proximité' })
  @ApiQuery({ name: 'latitude', type: Number, required: true })
  @ApiQuery({ name: 'longitude', type: Number, required: true })
  @ApiQuery({ name: 'radius', type: Number, required: false, description: 'Rayon en kilomètres (défaut: 5)' })
  @ApiResponse({ status: 200, description: 'Liste des pré-collecteurs à proximité' })
  async findNearbyCollectors(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number
  ) {
    return this.usersService.findNearbyPreCollectors(latitude, longitude, radius);
  }
}