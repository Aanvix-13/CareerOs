import { withAdmin } from '@/middleware/admin.middleware';
import profileService from '@/services/profile.service';
import { successResponse, handleApiError } from '@/lib/api-response';

export const GET = withAdmin(async (request, user) => {
  try {
    const profile = await profileService.getProfile(user.userId);
    return successResponse({ ...profile, email: user.email });
  } catch (error) {
    return handleApiError(error);
  }
});

export const PATCH = withAdmin(async (request: Request, user) => {
  try {
    const body = await request.json();
    const profile = await profileService.updateProfile(user.userId, body);
    return successResponse({ ...profile, email: user.email });
  } catch (error) {
    return handleApiError(error);
  }
});
