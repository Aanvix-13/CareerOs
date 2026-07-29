import profileService from '@/services/profile.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const profile = await profileService.getProfile(user.userId);
    return successResponse({
      id: user.userId,
      email: user.email,
      role: user.role || 'user',
      profile,
    });
  } catch (error) {
    return handleApiError(error);
  }
});

export const PUT = withAuth(async (request, user) => {
  try {
    return successResponse({ message: 'Password changes are managed securely through Clerk settings.' });
  } catch (error) {
    return handleApiError(error);
  }
});
