import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Patch,
  Param, 
  UseGuards,
  Query,
  Logger
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserResponse, UserLocationResponse, PreCollectorResponse } from './responses/user.responses';
import { CreateUserDto } from './dto/create-user.dto';
import { UserType } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersService.name);
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
  
  @Get('clients')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir la liste de tous les clients" })
  @ApiResponse({ status: 200, description: "Liste des clients", type: [UserResponse] })
  async findAllClients() {
    return this.usersService.findAllUsers(UserType.CLIENT);
  }

  @Get('precollectors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtenir la liste de tous les pré-collecteurs" })
  @ApiResponse({ status: 200, description: "Liste des pré-collecteurs", type: [PreCollectorResponse] })
  async findAllPreCollectors() {
    this.logger.debug('Début findAllPreCollectors');
    try {
      const result = await this.usersService.findAllUsers(UserType.PRE_COLLECTOR);
      this.logger.debug(`Résultat findAllPreCollectors: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur dans findAllPreCollectors: ${error.message}`, error.stack);
      throw error;
    }
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

  // @Get(':id/locations')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Obtenir l\'historique des positions d\'un pré-collecteur' })
  // @ApiResponse({ status: 200, description: 'Historique des positions', type: [UserLocationResponse] })
  // @ApiResponse({ status: 400, description: 'Utilisateur non pré-collecteur' })
  // @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  // async getUserLocations(@Param('id') id: string) {
  //   return this.usersService.getUserLocations(id);
  // }

  @Get('nearby/collectors')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Trouver les pré-collecteurs à proximité' })
  @ApiQuery({ name: 'latitude', type: Number, required: true })
  @ApiQuery({ name: 'longitude', type: Number, required: true })
  @ApiQuery({ name: 'radius', type: Number, required: false, description: 'Rayon en kilomètres (défaut: 5)' })
  @ApiResponse({ status: 200, description: 'Liste des pré-collecteurs à proximité', type: [PreCollectorResponse] })
  async findNearbyCollectors(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number
  ) {
    return this.usersService.findNearbyPreCollectors(latitude, longitude, radius);
  }
}