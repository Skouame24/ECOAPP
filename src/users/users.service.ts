import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, UserType } from '@prisma/client';

@Injectable()
export class UsersService {
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
      select: { type: true },
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

    return activeLocation;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
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
      const users = await this.prisma.user.findMany({
        where: { type },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          type: true,
          createdAt: true,
        },
      });
  
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la récupération des utilisateurs');
    }
  }
  

  async findNearbyPreCollectors(latitude: number, longitude: number, radiusInKm: number = 5) {
    // Conversion explicite des paramètres en nombres à virgule flottante
    const preCollectors = await this.prisma.$queryRaw`
      WITH distances AS (
        SELECT 
          u.id,
          u."firstName",
          u."lastName",
          u."phoneNumber",
          u.latitude::float8,
          u.longitude::float8,
          (
            6371.0 * acos(
              cos(radians(${latitude}::float8)) * 
              cos(radians(u.latitude::float8)) * 
              cos(radians(u.longitude::float8) - radians(${longitude}::float8)) + 
              sin(radians(${latitude}::float8)) * 
              sin(radians(u.latitude::float8))
            )
          )::float8 as distance
        FROM users u
        WHERE u.type = 'PRE_COLLECTOR'
        AND u.latitude IS NOT NULL
        AND u.longitude IS NOT NULL
      )
      SELECT *
      FROM distances
      WHERE distance <= ${radiusInKm}::float8
      ORDER BY distance;
    `;

    return preCollectors;
  }
}