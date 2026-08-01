import prisma from '../lib/prisma';
import { Application, ApplicationStatusHistory, ApplicationStatus } from '@prisma/client';
import buildPrismaQuery from '../utils/query-builder';

export class ApplicationRepository {
  async create(
    data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>,
    historyNotes?: string | null
  ): Promise<Application> {
    return prisma.$transaction(async (tx) => {
      // 1. Create the application
      const application = await tx.application.create({
        data,
      });

      // 2. Create the initial status history record
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          previousStatus: null,
          newStatus: application.currentStatus,
          notes: historyNotes || 'Application initialized.',
        },
      });

      // 3. Create a notification
      await tx.notification.create({
        data: {
          userId: application.userId,
          type: 'ApplicationCreated',
          title: 'Application Created',
          message: `Your job application to ${application.companyName} as ${application.jobTitle} has been recorded.`,
          status: 'Unread',
          relatedEntity: 'Application',
          relatedEntityId: application.id,
        },
      });

      return application;
    });
  }

  async update(id: string, data: Partial<Omit<Application, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Application> {
    return prisma.application.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: string,
    newStatus: ApplicationStatus,
    notes?: string | null
  ): Promise<Application> {
    return prisma.$transaction(async (tx) => {
      // 1. Get current application to find previous status
      const app = await tx.application.findUnique({
        where: { id },
        select: { currentStatus: true, userId: true, companyName: true, jobTitle: true },
      });

      if (!app) throw new Error('Application not found');

      const previousStatus = app.currentStatus;

      // 2. Update status
      const updatedApp = await tx.application.update({
        where: { id },
        data: { currentStatus: newStatus },
      });

      // 3. Add to status history
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: id,
          previousStatus,
          newStatus,
          notes,
        },
      });

      // 4. Create notification
      await tx.notification.create({
        data: {
          userId: app.userId,
          type: 'ApplicationUpdated',
          title: 'Application Status Updated',
          message: `Application to ${app.companyName} updated from ${previousStatus} to ${newStatus}.`,
          status: 'Unread',
          relatedEntity: 'Application',
          relatedEntityId: id,
        },
      });

      return updatedApp;
    });
  }

  async findById(id: string): Promise<Application | null> {
    return prisma.application.findUnique({
      where: { id },
      include: {
        resume: true,
        interviews: true,
        reminders: true,
        statusHistory: {
          orderBy: { changedAt: 'desc' },
        },
      },
    });
  }

  async findByUserId(
    userId: string,
    options: {
      search?: string;
      status?: ApplicationStatus;
      jobType?: string;
      workMode?: string;
      source?: string;
      skip?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      cursorId?: string;
    }
  ): Promise<{ applications: Application[]; total: number }> {
    const filters: Record<string, any> = { userId, deletedAt: null };
    if (options.status) filters.currentStatus = options.status;
    if (options.jobType) filters.jobType = options.jobType;
    if (options.workMode) filters.workMode = options.workMode;
    if (options.source) filters.source = options.source;

    const { where, orderBy } = buildPrismaQuery({
      search: options.search,
      searchFields: ['companyName', 'jobTitle', 'location', 'recruiterName'],
      filters,
      sort: options.sort,
      order: options.order,
    });

    const queryOptions: any = {
      where,
      orderBy,
      take: options.limit,
      include: {
        resume: {
          select: { id: true, name: true },
        },
      },
    };

    if (options.cursorId) {
      queryOptions.cursor = { id: options.cursorId };
      queryOptions.skip = 1;
    } else if (options.skip !== undefined) {
      queryOptions.skip = options.skip;
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany(queryOptions),
      prisma.application.count({ where }),
    ]);

    return { applications, total };
  }

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }

  async findHistoryByApplicationId(applicationId: string): Promise<ApplicationStatusHistory[]> {
    return prisma.applicationStatusHistory.findMany({
      where: { applicationId },
      orderBy: { changedAt: 'desc' },
    });
  }
}

export default new ApplicationRepository();
