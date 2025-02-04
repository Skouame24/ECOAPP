import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserType } from '@prisma/client';
import { SearchCollectorDto } from './dto/search-collectors.dto';
import { CollectorWithDistance } from './types';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async findNearbyCollectors(searchDto: SearchCollectorDto): Promise<CollectorWithDistance[]> {
    const lat = Number(searchDto.latitude);
    const lon = Number(searchDto.longitude);
    const radius = Number(searchDto.radius);
    const radiusInDegrees = radius / 111;

    const minLat = lat - radiusInDegrees;
    const maxLat = lat + radiusInDegrees;
    const minLon = lon - radiusInDegrees;
    const maxLon = lon + radiusInDegrees;

    const collectors = await this.prisma.user.findMany({
      where: {
        type: UserType.PRE_COLLECTOR,
        activeLocation: {
          AND: [
            {
              latitude: {
                gte: minLat,
                lte: maxLat
              }
            },
            {
              longitude: {
                gte: minLon,
                lte: maxLon
              }
            }
          ]
        }
      },
      include: {
        activeLocation: true
      }
    });

    return collectors
      .filter(collector => {
        const location = collector.activeLocation;
        if (!location) return false;
        
        const distance = this.calculateDistance(
          lat,
          lon,
          location.latitude,
          location.longitude
        );
        
        return distance <= radius;
      })
      .map(collector => ({
        id: collector.id,
        firstName: collector.firstName,
        lastName: collector.lastName,
        phoneNumber: collector.phoneNumber,
        latitude: collector.activeLocation!.latitude,
        longitude: collector.activeLocation!.longitude,
        distance: this.calculateDistance(
          lat,
          lon,
          collector.activeLocation!.latitude,
          collector.activeLocation!.longitude
        )
      }));
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}