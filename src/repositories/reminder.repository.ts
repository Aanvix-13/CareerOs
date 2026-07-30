import prisma from '../lib/prisma';
import { Reminder, ReminderPriority, ReminderStatus, ReminderType } from '@prisma/client';
import buildPrismaQuery from '../utils/query-builder';

export class ReminderRepository {
  async create(data: Omit<Reminder, 'id' | 'completedAt' | 'createdAt' | 'updatedAt' | 'status'> & { status?: ReminderStatus }): Promise<Reminder> {
    return prisma.$transaction(async (tx) => {
      const reminder = await tx.reminder.create({
        data: {
          ...data,
          status: data.status || 'Pending',
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: data.userId,
          type: 'ReminderDue',
          title: 'Reminder Created',
          message: `Reminder set: "${data.title}" due on ${data.dueDate.toISOString().split('T')[0]}.`,
          status: 'Unread',
          relatedEntity: 'Reminder',
          relatedEntityId: reminder.id,
        },
      });

      return reminder;
    });
  }

  async update(id: string, data: Partial<Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Reminder> {
    return prisma.reminder.update({
      where: { id },
      data,
    });
  }

  async findById(id: string) {
    return prisma.reminder.findUnique({
      where: { id },
      include: {
        application: {
          select: { id: true, companyName: true, jobTitle: true },
        },
      },
    });
  }

  async findByUserId(
    userId: string,
    options: {
      status?: ReminderStatus;
      priority?: ReminderPriority;
      reminderType?: ReminderType;
      skip?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{ reminders: Reminder[]; total: number }> {
    const filters: Record<string, any> = { userId };
    if (options.status) filters.status = options.status;
    if (options.priority) filters.priority = options.priority;
    if (options.reminderType) filters.reminderType = options.reminderType;

    const { where, orderBy } = buildPrismaQuery({
      searchFields: ['title', 'description'],
      filters,
      sort: options.sort,
      order: options.order,
    });

    const [reminders, total] = await Promise.all([
      prisma.reminder.findMany({
        where,
        orderBy,
        skip: options.skip,
        take: options.limit,
        include: {
          application: {
            select: { id: true, companyName: true, jobTitle: true },
          },
        },
      }),
      prisma.reminder.count({ where }),
    ]);

    return { reminders, total };
  }

  async delete(id: string): Promise<Reminder> {
    return prisma.reminder.delete({
      where: { id },
    });
  }

  async markCompleted(id: string): Promise<Reminder> {
    const existing = await prisma.reminder.findUnique({
      where: { id },
    });
    const isCompleted = existing?.status === 'Completed';
    return prisma.reminder.update({
      where: { id },
      data: {
        status: isCompleted ? 'Pending' : 'Completed',
        completedAt: isCompleted ? null : new Date(),
      },
    });
  }
}

export default new ReminderRepository();
