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
}

export default new UserRepository();
