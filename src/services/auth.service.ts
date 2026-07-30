import { currentUser } from '@clerk/nextjs/server';
import prisma from '../lib/prisma';
import notificationService from './notification.service';
import { User, Profile } from '@prisma/client';
import { AuthError } from '../lib/errors';

export class AuthService {
  async getOrCreateSyncUser(clerkUserId: string): Promise<{ user: User; profile: Profile | null }> {
    // 1. Find user by clerkId in our database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      include: { profile: true },
    });

    if (dbUser) {
      if (dbUser.isSuspended) {
        throw new AuthError('Your account has been suspended by an administrator.');
      }
      return { user: dbUser, profile: dbUser.profile };
    }

    // 2. If user is authenticated in Clerk but not synced yet, fetch full details from Clerk SDK
    let clerkUser = null;
    try {
      const { clerkClient } = await import('@clerk/nextjs/server');
      const client = typeof clerkClient === 'function' ? await (clerkClient as any)() : clerkClient;
      clerkUser = await client.users.getUser(clerkUserId);
    } catch (e) {
      console.warn('Failed to retrieve user via clerkClient:', e);
    }

    if (!clerkUser) {
      clerkUser = await currentUser();
    }

    if (!clerkUser) {
      throw new AuthError('Authenticated Clerk user profile not found.');
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || email.split('@')[0] || 'User';

    // 3. Self-healing transaction: Map clerkId to existing email OR create a new user and profile
    const result = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email },
        include: { profile: true },
      });

      if (existingUser) {
        const updatedUser = await tx.user.update({
          where: { id: existingUser.id },
          data: { clerkId: clerkUserId },
          include: { profile: true },
        });
        return { user: updatedUser, profile: updatedUser.profile };
      }

      const createdUser = await tx.user.create({
        data: {
          clerkId: clerkUserId,
          email,
          role: 'user',
        },
      });

      const createdProfile = await tx.profile.create({
        data: {
          userId: createdUser.id,
          fullName,
        },
      });

      return { user: createdUser, profile: createdProfile };
    });

    // 4. Dispatch welcome notification
    await notificationService.createNotification({
      userId: result.user.id,
      type: 'Welcome',
      title: 'Welcome to CareerOS!',
      message: `Hello ${fullName}, welcome to CareerOS. Start tracking your applications by uploading your first resume!`,
    });

    return result;
  }
}

export default new AuthService();
