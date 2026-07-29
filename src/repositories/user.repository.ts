import prisma from '../lib/prisma';
import { User, Profile } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    id?: string;
    email: string;
    fullName: string;
  }): Promise<{ user: User; profile: Profile }> {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: data.id,
          email: data.email.toLowerCase(),
        },
      });

      const profile = await tx.profile.create({
        data: {
          userId: user.id,
          fullName: data.fullName,
        },
      });

      return { user, profile };
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<User> {
    // Deprecated for Supabase Auth, but keeping signature for backward compatibility
    return prisma.user.findUniqueOrThrow({ where: { id } });
  }

  async findMany(params: {
    skip: number;
    take: number;
    search?: string;
    status?: 'active' | 'suspended';
    sortBy?: 'name' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<any[]> {
    const where: any = {};

    if (params.status) {
      where.isSuspended = params.status === 'suspended';
    }

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        {
          profile: {
            OR: [
              { fullName: { contains: params.search, mode: 'insensitive' } },
              { college: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (params.sortBy === 'name') {
      orderBy = { profile: { fullName: params.sortOrder || 'asc' } };
    } else if (params.sortBy === 'createdAt') {
      orderBy = { createdAt: params.sortOrder || 'desc' };
    }

    return prisma.user.findMany({
      where,
      skip: params.skip,
      take: params.take,
      orderBy,
      include: {
        profile: true,
        _count: {
          select: {
            applications: true,
            resumes: true,
          },
        },
      },
    });
  }

  async count(params: {
    search?: string;
    status?: 'active' | 'suspended';
  }): Promise<number> {
    const where: any = {};

    if (params.status) {
      where.isSuspended = params.status === 'suspended';
    }

    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        {
          profile: {
            OR: [
              { fullName: { contains: params.search, mode: 'insensitive' } },
              { college: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    return prisma.user.count({ where });
  }

  async updateSuspension(id: string, isSuspended: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isSuspended },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();

