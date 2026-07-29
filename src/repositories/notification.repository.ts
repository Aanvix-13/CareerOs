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

  async createMany(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'readAt'>[]): Promise<number> {
    const result = await prisma.notification.createMany({
      data,
    });
    return result.count;
  }

  async findMany(params: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<any[]> {
    const where: any = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { message: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.notification.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async count(params: {
    search?: string;
  }): Promise<number> {
    const where: any = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { message: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.notification.count({ where });
  }
}

export default new NotificationRepository();

