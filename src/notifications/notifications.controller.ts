import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/decorator/user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir toutes les notifications de l\'utilisateur' })
  async getUserNotifications(@User('id') userId: string) {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  async markAsRead(
    @User('id') userId: string,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(notificationId, userId);
  }
}