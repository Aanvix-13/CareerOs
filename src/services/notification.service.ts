import notificationRepository from '../repositories/notification.repository';
import { Notification, NotificationStatus, NotificationType } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../lib/errors';

export class NotificationService {
  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedEntity?: string | null;
    relatedEntityId?: string | null;
  }): Promise<Notification> {
    return notificationRepository.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      relatedEntity: data.relatedEntity ?? null,
      relatedEntityId: data.relatedEntityId ?? null,
      status: 'Unread',
    });
  }

  async getNotifications(
    userId: string,
    options: { status?: NotificationStatus; skip?: number; limit?: number }
  ): Promise<{ notifications: Notification[]; total: number }> {
    return notificationRepository.findByUserId(userId, options);
  }

  async markNotificationRead(userId: string, notificationId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found.');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError();
    }
    return notificationRepository.markRead(notificationId);
  }

  async markAllNotificationsRead(userId: string): Promise<number> {
    return notificationRepository.markAllRead(userId);
  }

  async deleteNotification(userId: string, notificationId: string): Promise<Notification> {
    const notification = await notificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundError('Notification not found.');
    }
    if (notification.userId !== userId) {
      throw new ForbiddenError();
    }
    return notificationRepository.delete(notificationId);
  }
}

export default new NotificationService();
