import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLocationDto } from './dto/update-location.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class LocationService {
  private supabase;

  constructor(private prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    // Vérifie que les variables d'environnement sont bien définies
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY sont nécessaires');
    }

    // Crée le client Supabase
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async updateLocation(preCollectorId: string, updateLocationDto: UpdateLocationDto) {
    // Mettre à jour la position active
    const activeLocation = await this.prisma.preCollectorLocation.upsert({
      where: { preCollectorId },
      update: {
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
      create: {
        preCollectorId,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
    });

    // Enregistrer dans l'historique
    await this.prisma.preCollectorLocationHistory.create({
      data: {
        preCollectorId,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
      },
    });

    // Publier la mise à jour via Supabase Realtime
    await this.supabase
      .from('pre_collector_locations')
      .upsert({
        pre_collector_id: preCollectorId,
        latitude: updateLocationDto.latitude,
        longitude: updateLocationDto.longitude,
        updated_at: new Date().toISOString(),
      });

    return activeLocation;
  }

  async getActiveLocation(preCollectorId: string) {
    return this.prisma.preCollectorLocation.findUnique({
      where: { preCollectorId },
    });
  }
}
