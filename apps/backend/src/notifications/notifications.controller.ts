import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { PushNotificationService } from './push-notification.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Get()
  async getNotifications(
    @CurrentUser() user: any,
    @Query('unread') unread?: string,
  ) {
    return this.notificationsService.getNotifications(
      user.id,
      unread === 'true',
    );
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Put('read-all')
  async markAllAsRead(@CurrentUser() user: any) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  @Post('push-token')
  @ApiOperation({
    summary: 'Register device push token',
    description:
      'Register a device push notification token (Expo, APNs, or FCM)',
  })
  @ApiResponse({
    status: 200,
    description: 'Push token registered successfully',
  })
  async registerPushToken(
    @CurrentUser() user: any,
    @Body() body: { pushToken: string },
  ) {
    await this.pushNotificationService.registerPushToken(
      user.id,
      body.pushToken,
    );
    return { message: 'Push token registered successfully' };
  }

  @Delete('push-token')
  @ApiOperation({
    summary: 'Remove device push token',
    description: 'Remove the registered push notification token',
  })
  @ApiResponse({
    status: 200,
    description: 'Push token removed successfully',
  })
  async removePushToken(@CurrentUser() user: any) {
    await this.pushNotificationService.removePushToken(user.id);
    return { message: 'Push token removed successfully' };
  }
}
