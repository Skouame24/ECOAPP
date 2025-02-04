import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../common/supabase/supabase.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class CollectionsService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private estimateArrivalTime(distance: number): number {
    const averageSpeed = 30;
    return Math.round((distance / averageSpeed) * 60);
  }

  async updatePreCollectorLocation(preCollectorId: string, location: UpdateLocationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: preCollectorId },
    });

    if (!user) {
      throw new NotFoundException('Pré-collecteur non trouvé');
    }

    if (user.type !== UserType.PRE_COLLECTOR) {
      throw new ForbiddenException('Seuls les pré-collecteurs peuvent mettre à jour leur position');
    }

    const { error } = await this.supabase.getClient()
      .from('pre_collector_locations')
      .upsert({
        pre_collector_id: preCollectorId,
        latitude: location.latitude,
        longitude: location.longitude,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error('Erreur lors de la mise à jour de la position');
    }

    return { message: 'Position mise à jour avec succès' };
  }

  async getPreCollectorLocation(preCollectorId: string, clientLocation?: { latitude: number; longitude: number }) {
    const user = await this.prisma.user.findUnique({
      where: { id: preCollectorId },
    });

    if (!user || user.type !== UserType.PRE_COLLECTOR) {
      throw new NotFoundException('Pré-collecteur non trouvé');
    }

    const { data: location, error } = await this.supabase.getClient()
      .from('pre_collector_locations')
      .select('*')
      .eq('pre_collector_id', preCollectorId)
      .single();

    if (error || !location) {
      throw new NotFoundException('Position non disponible');
    }

    if (clientLocation) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        clientLocation.latitude,
        clientLocation.longitude
      );

      const estimatedTime = this.estimateArrivalTime(distance);

      return {
        latitude: location.latitude,
        longitude: location.longitude,
        updated_at: location.updated_at,
        distance: Math.round(distance * 100) / 100,
        estimatedArrivalTime: estimatedTime,
      };
    }

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      updated_at: location.updated_at,
    };
  }

  async subscribeToLocation(preCollectorId: string) {
    return this.supabase.getClient()
      .channel('pre_collector_location')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pre_collector_locations',
          filter: `pre_collector_id=eq.${preCollectorId}`,
        },
        (payload) => {
          return payload.new;
        }
      )
      .subscribe();
  }

  async getLocationHistory(preCollectorId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: preCollectorId },
    });

    if (!user || user.type !== UserType.PRE_COLLECTOR) {
      throw new NotFoundException('Pré-collecteur non trouvé');
    }

    const { data: history, error } = await this.supabase.getClient()
      .from('pre_collector_location_history')
      .select('*')
      .eq('pre_collector_id', preCollectorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Erreur lors de la récupération de l\'historique');
    }

    return history;
  }
}