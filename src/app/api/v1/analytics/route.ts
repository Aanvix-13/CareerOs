import analyticsService from '@/services/analytics.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const data = await analyticsService.getAnalytics(user.userId);
    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
});
