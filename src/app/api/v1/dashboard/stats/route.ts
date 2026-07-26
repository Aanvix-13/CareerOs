import dashboardService from '@/services/dashboard.service';
import { successResponse, handleApiError } from '@/lib/api-response';
import { withAuth } from '@/middleware/auth.middleware';

export const GET = withAuth(async (request, user) => {
  try {
    const stats = await dashboardService.getSummaryStats(user.userId);
    return successResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
});
