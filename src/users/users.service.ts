import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserType, PointCategory } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Validate category for PRE_COLLECTOR
      if (createUserDto.type === UserType.PRE_COLLECTOR && !createUserDto.category) {
        throw new BadRequestException('La catégorie est requise pour les pré-collecteurs');
      }
  
      // Ensure category is only set for PRE_COLLECTOR
      if (createUserDto.type === UserType.CLIENT && createUserDto.category) {
        throw new BadRequestException('La catégorie ne peut être définie que pour les pré-collecteurs');
      }
  
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const user = await this.prisma.user.create({
        data: {
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: hashedPassword,
          phoneNumber: createUserDto.phoneNumber,
          type: createUserDto.type,
          category: createUserDto.type === UserType.PRE_COLLECTOR ? createUserDto.category : undefined,
          latitude: createUserDto.latitude,
          longitude: createUserDto.longitude,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          type: true,
          category: true,  // Make sure category is included in select
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          activeLocation: true,
        },
      });
  
      // Si c'est un PRE_COLLECTOR et qu'il a des coordonnées, créer sa position active
      if (user.type === UserType.PRE_COLLECTOR && createUserDto.latitude && createUserDto.longitude) {
        await this.prisma.preCollectorLocation.create({
          data: {
            preCollectorId: user.id,
            latitude: createUserDto.latitude,
            longitude: createUserDto.longitude,
          },
        });
  
        // Ajouter à l'historique des positions
        await this.prisma.preCollectorLocationHistory.create({
          data: {
            preCollectorId: user.id,
            latitude: createUserDto.latitude,
            longitude: createUserDto.longitude,
          },
        });
      }
  
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Cet email est déjà utilisé');
        }
      }
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const data: Prisma.UserUpdateInput = { ...updateUserDto };
      
      if (updateUserDto.password) {
        data.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          type: true,
          category: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          activeLocation: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Utilisateur non trouvé');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Cet email est déjà utilisé');
        }
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        type: true,
        category: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        activeLocation: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        type: true,
        category: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        updatedAt: true,
        activeLocation: {
          select: {
            latitude: true,
            longitude: true,
            updatedAt: true,
          }
        },
        locationHistory: {
          select: {
            latitude: true,
            longitude: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 100
        }
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async findAllUsers(type: UserType) {
    try {
      this.logger.debug(`Début findAllUsers pour le type: ${type}`);
      
      const users = await this.prisma.user.findMany({
        where: { type },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          type: true,
          category: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          updatedAt: true,
          activeLocation: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              updatedAt: true
            }
          },
          locationHistory: {
            select: {
              id: true,
              latitude: true,
              longitude: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 10
          }
        }
      });

      this.logger.debug(`Utilisateurs trouvés: ${JSON.stringify(users)}`);

      const mappedUsers = users.map(user => {
        // Base user object with all common fields
        const baseUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          type: user.type,
          category: user.category,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          latitude: user.activeLocation?.latitude ?? user.latitude,
          longitude: user.activeLocation?.longitude ?? user.longitude
        };

        // Add PRE_COLLECTOR specific fields if applicable
        if (type === UserType.PRE_COLLECTOR) {
          return {
            ...baseUser,
            activeLocation: user.activeLocation ? {
              id: user.activeLocation.id,
              latitude: user.activeLocation.latitude,
              longitude: user.activeLocation.longitude,
              updatedAt: user.activeLocation.updatedAt
            } : null,
            locationHistory: user.locationHistory.map(location => ({
              id: location.id,
              latitude: location.latitude,
              longitude: location.longitude,
              createdAt: location.createdAt
            }))
          };
        }

        return baseUser;
      });

      this.logger.debug(`Résultat final: ${JSON.stringify(mappedUsers)}`);
      return mappedUsers;

    } catch (error) {
      this.logger.error(`Erreur dans findAllUsers: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Erreur lors de la récupération des utilisateurs');
    }
  }

  async findNearbyPreCollectors(latitude: number, longitude: number, radiusInKm: number = 5) {
    const preCollectors = await this.prisma.$queryRaw`
      WITH distances AS (
        SELECT 
          u.id,
          u."firstName",
          u."lastName",
          u."phoneNumber",
          u.category,
          u.latitude::float8,
          u.longitude::float8,
          pcl.latitude as active_latitude,
          pcl.longitude as active_longitude,
          pcl."updatedAt" as location_updated_at,
          (
            6371.0 * acos(
              cos(radians(${latitude}::float8)) * 
              cos(radians(COALESCE(pcl.latitude, u.latitude)::float8)) * 
              cos(radians(COALESCE(pcl.longitude, u.longitude)::float8) - radians(${longitude}::float8)) + 
              sin(radians(${latitude}::float8)) * 
              sin(radians(COALESCE(pcl.latitude, u.latitude)::float8))
            )
          )::float8 as distance
        FROM users u
        LEFT JOIN pre_collector_locations pcl ON u.id = pcl."preCollectorId"
        WHERE u.type = 'PRE_COLLECTOR'
        AND (u.latitude IS NOT NULL OR pcl.latitude IS NOT NULL)
        AND (u.longitude IS NOT NULL OR pcl.longitude IS NOT NULL)
      )
      SELECT 
        id,
        "firstName",
        "lastName",
        "phoneNumber",
        category,
        COALESCE(active_latitude, latitude) as latitude,
        COALESCE(active_longitude, longitude) as longitude,
        location_updated_at,
        distance
      FROM distances
      WHERE distance <= ${radiusInKm}::float8
      ORDER BY distance;
    `;

    return preCollectors;
  }
}