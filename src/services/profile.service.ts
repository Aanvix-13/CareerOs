import profileRepository from '../repositories/profile.repository';
import { Profile } from '@prisma/client';
import { NotFoundError } from '../lib/errors';

export class ProfileService {
  async getProfile(userId: string): Promise<Profile> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    data: Partial<Omit<Profile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Profile> {
    const profile = await profileRepository.findByUserId(userId);
    if (!profile) {
      throw new NotFoundError('Profile not found.');
    }
    return profileRepository.update(userId, data);
  }
}

export default new ProfileService();
