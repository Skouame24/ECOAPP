import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';
import { NotificationStatus } from '@prisma/client';

@Injectable()
export class NotificationsService {
  private supabase;

  constructor(private prisma: PrismaService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    // Vérifie que les variables d'environnement sont définies
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY sont nécessaires');
    }

    // Crée le client Supabase
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async createNotification(userId: string, message: string) {
    // Créer la notification dans la base de données
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        message,
        status: NotificationStatus.UNREAD,
      },
    });

    // Envoyer la notification en temps réel via Supabase
    await this.supabase
      .from('notifications')
      .insert({
        id: notification.id,
        user_id: userId,
        message: message,
        status: 'UNREAD',
        created_at: new Date().toISOString(),
      });

    return notification;
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId, // Sécurité: vérifier que la notification appartient à l'utilisateur
      },
      data: {
        status: NotificationStatus.READ,
      },
    });
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
