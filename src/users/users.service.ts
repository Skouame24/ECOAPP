import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name); // Create a logger instance

  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phoneNumber: true,
          type: true,
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

  async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { 
        type: true,
        activeLocation: true 
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.type !== UserType.PRE_COLLECTOR) {
      throw new BadRequestException('Seuls les pré-collecteurs peuvent mettre à jour leur position');
    }

    // Update user's current location
    await this.prisma.user.update({
      where: { id },
      data: {
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
    });

    // Update or create active location
    const activeLocation = await this.prisma.preCollectorLocation.upsert({
      where: { preCollectorId: id },
      update: {
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
      create: {
        preCollectorId: id,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
    });

    // Add to location history
    await this.prisma.preCollectorLocationHistory.create({
      data: {
        preCollectorId: id,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
    });

    return {
      ...activeLocation,
      message: 'Position mise à jour avec succès'
    };
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
          take: 100 // Limit to last 100 locations
        }
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async getUserLocations(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        activeLocation: true,
        locationHistory: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 100 // Limit to last 100 locations
        }
      }
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (user.type !== UserType.PRE_COLLECTOR) {
      throw new BadRequestException('Seuls les pré-collecteurs ont un historique de localisation');
    }

    return {
      activeLocation: user.activeLocation,
      locationHistory: user.locationHistory
    };
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
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          // Always include latitude and longitude, using activeLocation if available
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