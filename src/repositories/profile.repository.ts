import prisma from '../lib/prisma';
import { Profile } from '@prisma/client';

export class ProfileRepository {
  async findByUserId(userId: string): Promise<Profile | null> {
    return prisma.profile.findUnique({
      where: { userId },
    });
  }

  async update(userId: string, data: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Profile> {
    return prisma.profile.update({
      where: { userId },
      data,
    });
  }
}

export default new ProfileRepository();
