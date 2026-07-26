import prisma from '../lib/prisma';
import { Notification, NotificationStatus } from '@prisma/client';

export class NotificationRepository {
  async create(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'readAt'>): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({
      where: { id },
    });
  }

  async findByUserId(
    userId: string,
    options: { status?: NotificationStatus; skip?: number; limit?: number }
  ): Promise<{ notifications: Notification[]; total: number }> {
    const where: Record<string, any> = { userId };
    if (options.status) where.status = options.status;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: options.skip,
        take: options.limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total };
  }

  async markRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: {
        status: 'Read',
        readAt: new Date(),
      },
    });
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await prisma.notification.updateMany({
      where: { userId, status: 'Unread' },
      data: {
        status: 'Read',
        readAt: new Date(),
      },
    });
    return result.count;
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({
      where: { id },
    });
  }
}

export default new NotificationRepository();
