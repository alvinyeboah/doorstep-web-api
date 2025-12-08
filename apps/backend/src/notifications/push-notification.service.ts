import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Push Notification Service
 * Supports Expo Push Notifications (free, no Google required)
 *
 * For native iOS/Android:
 * - iOS: Use APNs directly
 * - Android: Use your own push server or OneSignal
 *
 * For React Native with Expo:
 * - Uses Expo Push Notification service
 * - Tokens start with "ExponentPushToken["
 */
@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private readonly expoApiUrl = 'https://exp.host/--/api/v2/push/send';

  constructor(private prisma: PrismaService) {}

  /**
   * Send push notification to a user's device
   */
  async sendPushToUser(
    userId: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { pushToken: true },
      });

      if (!user || !user.pushToken) {
        this.logger.warn(`No push token found for user ${userId}`);
        return false;
      }

      return await this.sendPush(user.pushToken, notification);
    } catch (error) {
      this.logger.error('Failed to send push notification:', error);
      return false;
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendPushToUsers(
    userIds: string[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ): Promise<void> {
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        pushToken: { not: null },
      },
      select: { pushToken: true },
    });

    const tokens = users
      .map((u: { pushToken: string | null }) => u.pushToken)
      .filter((t: string | null): t is string => t !== null);

    if (tokens.length === 0) {
      this.logger.warn('No valid push tokens found');
      return;
    }

    await this.sendBatchPush(tokens, notification);
  }

  /**
   * Send push notification to a specific token
   */
  async sendPush(
    pushToken: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
      sound?: string;
      badge?: number;
    },
  ): Promise<boolean> {
    try {
      // Check if it's an Expo push token
      if (pushToken.startsWith('ExponentPushToken[')) {
        return await this.sendExpoPush(pushToken, notification);
      }

      // For native tokens, you'd implement APNs/FCM here
      this.logger.warn(
        `Unsupported push token format: ${pushToken.substring(0, 20)}...`,
      );
      return false;
    } catch (error) {
      this.logger.error('Failed to send push:', error);
      return false;
    }
  }

  /**
   * Send push to multiple tokens
   */
  async sendBatchPush(
    tokens: string[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ): Promise<void> {
    const expoTokens = tokens.filter((t) =>
      t.startsWith('ExponentPushToken['),
    );

    if (expoTokens.length > 0) {
      await this.sendExpoBatchPush(expoTokens, notification);
    }
  }

  /**
   * Send notification via Expo Push Notification service
   */
  private async sendExpoPush(
    token: string,
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
      sound?: string;
      badge?: number;
    },
  ): Promise<boolean> {
    try {
      const message = {
        to: token,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: notification.sound || 'default',
        badge: notification.badge,
      };

      const response = await fetch(this.expoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();

      if (result.data && result.data[0]?.status === 'error') {
        this.logger.error('Expo push error:', result.data[0]?.message);
        return false;
      }

      this.logger.log(`Push sent successfully to ${token.substring(0, 20)}...`);
      return true;
    } catch (error) {
      this.logger.error('Expo push failed:', error);
      return false;
    }
  }

  /**
   * Send notifications to multiple Expo tokens
   */
  private async sendExpoBatchPush(
    tokens: string[],
    notification: {
      title: string;
      body: string;
      data?: Record<string, any>;
    },
  ): Promise<void> {
    try {
      const messages = tokens.map((token) => ({
        to: token,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        sound: 'default',
      }));

      const response = await fetch(this.expoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messages),
      });

      const result = await response.json();
      this.logger.log(`Batch push sent to ${tokens.length} devices`);
    } catch (error) {
      this.logger.error('Batch push failed:', error);
    }
  }

  /**
   * Save user's push token
   */
  async registerPushToken(userId: string, pushToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pushToken },
    });

    this.logger.log(`Push token registered for user ${userId}`);
  }

  /**
   * Remove user's push token
   */
  async removePushToken(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pushToken: null },
    });

    this.logger.log(`Push token removed for user ${userId}`);
  }
}
