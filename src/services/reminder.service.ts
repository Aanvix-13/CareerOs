import reminderRepository from '../repositories/reminder.repository';
import applicationRepository from '../repositories/application.repository';
import interviewRepository from '../repositories/interview.repository';
import { Reminder, ReminderPriority, ReminderStatus, ReminderType } from '@prisma/client';
import { ForbiddenError, NotFoundError } from '../lib/errors';

export class ReminderService {
  async createReminder(
    userId: string,
    data: Omit<Reminder, 'id' | 'completedAt' | 'createdAt' | 'updatedAt' | 'status' | 'userId'> & { status?: ReminderStatus }
  ): Promise<Reminder> {
    // 1. Verify application ownership if provided
    if (data.applicationId) {
      const application = await applicationRepository.findById(data.applicationId);
      if (!application || application.userId !== userId) {
        throw new ForbiddenError('You can only link reminders to your own applications.');
      }
    }

    // 2. Verify interview round ownership if provided
    if (data.interviewId) {
      const interview = await interviewRepository.findById(data.interviewId);
      if (!interview || interview.application.userId !== userId) {
        throw new ForbiddenError('You can only link reminders to your own interviews.');
      }
    }

    return reminderRepository.create({
      ...data,
      userId,
    });
  }

  async updateReminder(
    userId: string,
    id: string,
    data: Partial<Omit<Reminder, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Reminder> {
    const reminder = await reminderRepository.findById(id);
    if (!reminder) {
      throw new NotFoundError('Reminder not found.');
    }
    if (reminder.userId !== userId) {
      throw new ForbiddenError();
    }

    // Verify application
    if (data.applicationId) {
      const application = await applicationRepository.findById(data.applicationId);
      if (!application || application.userId !== userId) {
        throw new ForbiddenError('You can only link reminders to your own applications.');
      }
    }

    // Verify interview
    if (data.interviewId) {
      const interview = await interviewRepository.findById(data.interviewId);
      if (!interview || interview.application.userId !== userId) {
        throw new ForbiddenError('You can only link reminders to your own interviews.');
      }
    }

    return reminderRepository.update(id, data);
  }

  async getReminder(userId: string, id: string): Promise<Reminder> {
    const reminder = await reminderRepository.findById(id);
    if (!reminder) {
      throw new NotFoundError('Reminder not found.');
    }
    if (reminder.userId !== userId) {
      throw new ForbiddenError();
    }
    return reminder;
  }

  async listReminders(
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
  ): Promise<{ data: Reminder[]; total: number }> {
    const { reminders, total } = await reminderRepository.findByUserId(userId, options);
    return { data: reminders, total };
  }

  async deleteReminder(userId: string, id: string): Promise<Reminder> {
    const reminder = await reminderRepository.findById(id);
    if (!reminder) {
      throw new NotFoundError('Reminder not found.');
    }
    if (reminder.userId !== userId) {
      throw new ForbiddenError();
    }

    return reminderRepository.delete(id);
  }

  async markCompleted(userId: string, id: string): Promise<Reminder> {
    const reminder = await reminderRepository.findById(id);
    if (!reminder) {
      throw new NotFoundError('Reminder not found.');
    }
    if (reminder.userId !== userId) {
      throw new ForbiddenError();
    }

    return reminderRepository.markCompleted(id);
  }
}

export default new ReminderService();
