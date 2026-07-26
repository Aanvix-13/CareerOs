import prisma from '../lib/prisma';
import { Feedback } from '@prisma/client';

export class FeedbackRepository {
  async create(data: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'status'>): Promise<Feedback> {
    return prisma.feedback.create({
      data: {
        ...data,
        status: 'Submitted',
      },
    });
  }

  async findById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<Feedback[]> {
    return prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string): Promise<Feedback> {
    return prisma.feedback.delete({
      where: { id },
    });
  }
}

export default new FeedbackRepository();
