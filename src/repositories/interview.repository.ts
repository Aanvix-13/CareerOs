import prisma from '../lib/prisma';
import { Interview, InterviewStatus, InterviewResult } from '@prisma/client';
import buildPrismaQuery from '../utils/query-builder';

export class InterviewRepository {
  async create(data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>): Promise<Interview> {
    return prisma.$transaction(async (tx) => {
      // 1. Create the interview
      const interview = await tx.interview.create({
        data,
      });

      // 2. Fetch the application info for notification
      const app = await tx.application.findUnique({
        where: { id: data.applicationId },
        select: { userId: true, companyName: true, jobTitle: true },
      });

      if (app) {
        // 3. Create a notification
        await tx.notification.create({
          data: {
            userId: app.userId,
            type: 'InterviewScheduled',
            title: 'Interview Scheduled',
            message: `A new interview for ${app.companyName} (${interview.interviewRound}) has been scheduled on ${data.scheduledDate.toISOString().split('T')[0]}.`,
            status: 'Unread',
            relatedEntity: 'Interview',
            relatedEntityId: interview.id,
          },
        });
      }

      return interview;
    });
  }

  async update(id: string, data: Partial<Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Interview> {
    return prisma.interview.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: string,
    status: InterviewStatus,
    result: InterviewResult,
    feedback?: string | null,
    questions?: string | null
  ): Promise<Interview> {
    return prisma.$transaction(async (tx) => {
      const interview = await tx.interview.update({
        where: { id },
        data: {
          status,
          result,
          interviewFeedback: feedback,
          questionsAsked: questions,
        },
      });

      const app = await tx.application.findUnique({
        where: { id: interview.applicationId },
        select: { userId: true, companyName: true },
      });

      if (app) {
        await tx.notification.create({
          data: {
            userId: app.userId,
            type: 'InterviewScheduled', // We can use InterviewScheduled as generic type
            title: 'Interview Status Updated',
            message: `Interview result for ${app.companyName} (${interview.interviewRound}) is marked as ${result} (${status}).`,
            status: 'Unread',
            relatedEntity: 'Interview',
            relatedEntityId: id,
          },
        });
      }

      return interview;
    });
  }

  async findById(id: string) {
    return prisma.interview.findUnique({
      where: { id },
      include: {
        application: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
            userId: true,
          },
        },
      },
    });
  }

  async findByUserId(
    userId: string,
    options: {
      applicationId?: string;
      status?: InterviewStatus;
      result?: InterviewResult;
      skip?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{ interviews: Interview[]; total: number }> {
    const filters: Record<string, any> = {
      application: {
        userId,
      },
    };

    if (options.applicationId) filters.applicationId = options.applicationId;
    if (options.status) filters.status = options.status;
    if (options.result) filters.result = options.result;

    const { where, orderBy } = buildPrismaQuery({
      filters,
      sort: options.sort,
      order: options.order,
    });

    const [interviews, total] = await Promise.all([
      prisma.interview.findMany({
        where,
        orderBy,
        skip: options.skip,
        take: options.limit,
        include: {
          application: {
            select: {
              id: true,
              companyName: true,
              jobTitle: true,
            },
          },
        },
      }),
      prisma.interview.count({ where }),
    ]);

    return { interviews, total };
  }

  async delete(id: string): Promise<Interview> {
    return prisma.interview.delete({
      where: { id },
    });
  }
}

export default new InterviewRepository();
