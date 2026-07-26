import prisma from '../lib/prisma';
import { Resume } from '@prisma/client';
import buildPrismaQuery from '../utils/query-builder';

export class ResumeRepository {
  async create(data: {
    userId: string;
    name: string;
    targetRole?: string | null;
    version?: string | null;
    notes?: string | null;
    fileUrl: string;
    fileSize: number;
    isDefault?: boolean;
  }): Promise<Resume> {
    return prisma.$transaction(async (tx) => {
      // If setting as default, clear other defaults first
      if (data.isDefault) {
        await tx.resume.updateMany({
          where: { userId: data.userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.resume.create({
        data,
      });
    });
  }

  async update(id: string, data: Partial<Omit<Resume, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Resume> {
    return prisma.resume.update({
      where: { id },
      data,
    });
  }

  async findById(id: string): Promise<Resume | null> {
    return prisma.resume.findUnique({
      where: { id },
      include: {
        applications: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
          },
        },
      },
    });
  }

  async findByUserId(
    userId: string,
    options: { search?: string; skip?: number; limit?: number; sort?: string; order?: 'asc' | 'desc' }
  ): Promise<{ resumes: Resume[]; total: number }> {
    const { where, orderBy } = buildPrismaQuery({
      search: options.search,
      searchFields: ['name', 'targetRole'],
      filters: { userId },
      sort: options.sort,
      order: options.order,
    });

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        orderBy,
        skip: options.skip,
        take: options.limit,
      }),
      prisma.resume.count({ where }),
    ]);

    return { resumes, total };
  }

  async findDefaultByUserId(userId: string): Promise<Resume | null> {
    return prisma.resume.findFirst({
      where: { userId, isDefault: true },
    });
  }

  async delete(id: string): Promise<Resume> {
    return prisma.resume.delete({
      where: { id },
    });
  }

  async isReferencedByApplications(id: string): Promise<boolean> {
    const count = await prisma.application.count({
      where: { resumeId: id },
    });
    return count > 0;
  }

  async setAsDefault(userId: string, resumeId: string): Promise<Resume> {
    return prisma.$transaction(async (tx) => {
      // Clear other defaults
      await tx.resume.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });

      // Set this one as default
      return tx.resume.update({
        where: { id: resumeId },
        data: { isDefault: true },
      });
    });
  }
}

export default new ResumeRepository();
