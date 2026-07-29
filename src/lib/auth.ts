import { auth } from '@clerk/nextjs/server';
import { AuthError } from './errors';
import authService from '../services/auth.service';

export interface TokenPayload {
  userId: string; // Relational database UUID
  email: string;
  role?: string;
}

export async function getCurrentUser(request?: Request): Promise<TokenPayload> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new AuthError('Authentication session not found.');
  }

  try {
    // Resolve/sync Clerk user with PostgreSQL database
    const { user } = await authService.getOrCreateSyncUser(clerkId);
    
    return {
      userId: user.id, // Relational database UUID
      email: user.email,
      role: user.role,
    };
  } catch (error: any) {
    throw new AuthError(error.message || 'Failed to authenticate user.');
  }
}
