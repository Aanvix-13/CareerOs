import prisma from '../lib/prisma';
import { Feedback } from '@prisma/client';

export class FeedbackRepository {
  async create(data: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'submittedAt' | 'status' | 'adminNotes'>): Promise<Feedback> {
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

  async findMany(params: {
    skip: number;
    take: number;
    search?: string;
    category?: any;
    status?: any;
  }): Promise<any[]> {
    const where: any = {};

    if (params.category) {
      where.category = params.category;
    }
    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { email: { contains: params.search, mode: 'insensitive' } },
              { profile: { fullName: { contains: params.search, mode: 'insensitive' } } },
            ],
          },
        },
      ];
    }

    return prisma.feedback.findMany({
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
    category?: any;
    status?: any;
  }): Promise<number> {
    const where: any = {};

    if (params.category) {
      where.category = params.category;
    }
    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { email: { contains: params.search, mode: 'insensitive' } },
              { profile: { fullName: { contains: params.search, mode: 'insensitive' } } },
            ],
          },
        },
      ];
    }

    return prisma.feedback.count({ where });
  }

  async update(id: string, data: { status?: any; adminNotes?: string }): Promise<Feedback> {
    return prisma.feedback.update({
      where: { id },
      data,
    });
  }
}

export default new FeedbackRepository();

